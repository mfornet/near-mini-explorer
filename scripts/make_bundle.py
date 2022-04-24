# TODO: Use json-schemas to make sure the json description is properly formatted
# TODO: Initiate this program in watchdog mode: https://thepythoncorner.com/posts/2019-01-13-how-to-create-a-watchdog-in-python-to-look-for-filesystem-changes/
import json
from pathlib import Path

SOURCE_DIRECTORY = Path(__file__).parent / ".." / "library" / "transactions"
TARGET_FILE = Path(__file__).parent / ".." / "src" / \
    "library-tools" / "bundle.json"


def main():
    bundle = []
    for p in SOURCE_DIRECTORY.glob("**/*.json"):
        with open(p) as f:
            data = json.load(f)
        bundle.append(data)

    with open(TARGET_FILE, "w") as f:
        json.dump({"descriptions": bundle}, f, indent=4)


if __name__ == '__main__':
    main()
