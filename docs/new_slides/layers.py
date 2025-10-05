#!/usr/bin/env python
# exportable_layers.py
import sys
import xml.etree.ElementTree as ET

def is_exportable(elem):
    # Check if the group has at least one visible shape (e.g., <path>, <rect>, etc.)
    for child in elem:
        if child.tag.endswith('path') or child.tag.endswith('rect') or child.tag.endswith('circle') or child.tag.endswith('ellipse') or child.tag.endswith('line') or child.tag.endswith('image') or child.tag.endswith('use') or child.tag.endswith('text'):
            return True
    return False

def list_exportable_layers(svg_path):
    ns = {
        'svg': 'http://www.w3.org/2000/svg',
        'inkscape': 'http://www.inkscape.org/namespaces/inkscape'
    }

    tree = ET.parse(svg_path)
    root = tree.getroot()

    for elem in root.findall('.//svg:g', ns):
        groupmode = elem.attrib.get('{http://www.inkscape.org/namespaces/inkscape}groupmode')
        id_attr = elem.attrib.get('id')
        if groupmode == 'layer' and id_attr and is_exportable(elem):
            print(id_attr)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python exportable_layers.py yourfile.svg")
        sys.exit(1)
    list_exportable_layers(sys.argv[1])
