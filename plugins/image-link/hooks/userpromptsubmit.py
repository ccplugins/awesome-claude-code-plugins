#!/usr/bin/env python3
"""
Claude Image Link - UserPromptSubmit Hook

When you paste images into Claude Code, this hook:
1. Saves images to /tmp/claude_img_*.png
2. Provides clickable paths (Cmd+click in iTerm2/Terminal)

Install: Run install.sh or manually add to ~/.claude/settings.json
"""

import json
import sys
import os
import subprocess
import base64

SHOWN_IMAGES_FILE = "/tmp/claude_shown_images.json"
NEW_IMAGES_FILE = "/tmp/claude_new_images.txt"


def get_shown_images():
    """Load set of already-shown image hashes"""
    try:
        if os.path.exists(SHOWN_IMAGES_FILE):
            with open(SHOWN_IMAGES_FILE, 'r') as f:
                return set(json.load(f))
    except:
        pass
    return set()


def save_shown_images(shown):
    """Save shown image hashes"""
    try:
        with open(SHOWN_IMAGES_FILE, 'w') as f:
            json.dump(list(shown), f)
    except:
        pass


def notify_new_images(new_count, new_paths):
    """Show notification for new images"""
    try:
        subprocess.Popen([
            'osascript', '-e',
            f'display notification "{new_count} image(s) attached" with title "Claude Images" sound name "Pop"'
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except:
        pass


def find_images_in_transcript(transcript_path):
    """Find images in Claude Code transcript"""
    images = []

    try:
        with open(transcript_path, 'r') as f:
            for line in f:
                try:
                    message = json.loads(line.strip())
                    content = message.get('message', {}).get('content', [])

                    if not isinstance(content, list):
                        continue

                    for block in content:
                        if not isinstance(block, dict):
                            continue

                        if block.get('type') == 'image':
                            source = block.get('source', {})
                            if source.get('type') == 'base64':
                                data = source.get('data', '')[:50]
                                images.append(('base64', data, block))
                            elif 'path' in source:
                                images.append(('path', source['path'], block))

                        if 'file' in block:
                            file_info = block.get('file', {})
                            if 'path' in file_info:
                                images.append(('path', file_info['path'], block))

                except json.JSONDecodeError:
                    continue
    except:
        pass

    return images


def main():
    try:
        input_data = json.load(sys.stdin)
        transcript_path = input_data.get('transcript_path', '')

        if not transcript_path or not os.path.exists(transcript_path):
            print(json.dumps({}))
            sys.exit(0)

        shown_images = get_shown_images()
        images = find_images_in_transcript(transcript_path)

        new_image_paths = []

        for img_type, img_id, block in images:
            if img_id in shown_images:
                continue

            shown_images.add(img_id)

            if img_type == 'base64':
                try:
                    source = block.get('source', {})
                    data = source.get('data', '')
                    media_type = source.get('media_type', 'image/png')
                    ext = media_type.split('/')[-1] if '/' in media_type else 'png'

                    tmp_path = f"/tmp/claude_img_{hash(data)}.{ext}"
                    with open(tmp_path, 'wb') as f:
                        f.write(base64.b64decode(data))
                    new_image_paths.append(tmp_path)
                except:
                    pass
            elif img_type == 'path':
                new_image_paths.append(img_id)

        if new_image_paths:
            save_shown_images(shown_images)
            notify_new_images(len(new_image_paths), new_image_paths)

            # Save latest image path for Claude to read
            with open(NEW_IMAGES_FILE, 'w') as f:
                f.write(new_image_paths[-1] if new_image_paths else '')

        print(json.dumps({}))

    except Exception as e:
        print(json.dumps({}))

    sys.exit(0)


if __name__ == '__main__':
    main()
