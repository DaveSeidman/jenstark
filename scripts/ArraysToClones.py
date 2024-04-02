# this script will find any objects in your scene with the array modifier and create empty objects in the locations the array modifier would place them
# it will name them with the same name as the original mesh and append the suffix "_clone.001", "clone.002", etc
# open and run this script in blender before exporting the GLB
# it works in concert with our app which searches for meshes with the suffix "clone" and then duplicates the object
# in threejs instead of downloading it for every instance
# make sure to only use Constant Offset Arrays and to apply rotation and scale to the object before running the script
import bpy
import mathutils

def calculate_array_positions(obj, modifier):
    # Get the original object's location and rotation
    obj_loc, obj_rot, obj_scale = obj.matrix_world.decompose()
    # Get the array modifier's parameters
    count = modifier.count
    offset = mathutils.Vector((0, 0, 0))
    if modifier.use_constant_offset:
        offset += modifier.constant_offset_displace.copy()
    if modifier.use_relative_offset:
        offset += modifier.relative_offset_displace.copy()
    # Calculate the new positions for each instance
    positions = [obj_loc + offset * i for i in range(count)]
    return positions

def delete_existing_clones():
    # Delete existing empty objects with "clone" in their name
    existing_clones = [obj for obj in bpy.data.objects if obj.type == 'EMPTY' and "clone" in obj.name.lower()]
    for clone in existing_clones:
        bpy.data.objects.remove(clone, do_unlink=True)

def create_empty_clone(obj, positions):
    # Create empty objects as clones at the calculated positions
    for i, pos in enumerate(positions[1:], start=1):  # Skip the first clone
        empty_name = f"{obj.name}_clone.{i+1:03}"
        empty = bpy.data.objects.new(empty_name, None)
        bpy.context.collection.objects.link(empty)
        empty.location = pos
        print(f"Created empty clone: {empty_name} at position {pos}")

def main():
    # Delete existing clones before creating new ones
    delete_existing_clones()
    
    # Traverse through all objects in the scene
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            # Check if the object has an array modifier
            array_modifiers = [modifier for modifier in obj.modifiers if modifier.type == 'ARRAY']
            if array_modifiers:
                for modifier in array_modifiers:
                    # Calculate the arrayed instance positions
                    positions = calculate_array_positions(obj, modifier)
                    # Create empty objects as clones, skipping the first clone
                    create_empty_clone(obj, positions)

if __name__ == "__main__":
    main()
