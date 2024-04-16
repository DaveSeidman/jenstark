# Jen Stark WebGL Website

This website is a combination of a traditional ReactJS build and a React-Three-Fiber canvas. Please read this document in its entirety before starting work. Small changes in the model file or scene settings could lead to unexpected visual changes in the 3D scene.


## Getting Started / Installation

### Software Verions:

Node LTS (v21.6.0)
Blender 3.5.1 (or newer)

`npm install` *  
`npm start`  

visit http://localhost:8080 in your browser

### Files

All the files needed to construct the website are in the repo, and the 3D Scene file and assets are [here](https://drive.google.com/drive/folders/12VWQ296W904y3UMSbcYqnEPqUxdDzN-Z?usp=sharing). Download and unzip those files into an `/etc` folder at the root of the project. All the static assets required for the scene are under the textures folder, and the videos are under the `public/videos/` folder.

A good first step would be to match Blender versions and try opening the scene.blend file to make sure all the textures link properly. If the folder structure remains the same (scene file under /etc, static textures under /etc/textures, video textures under /public/videos) then Blender should locate everything based on relative path. Do not attempt to relink textures as there are currently over 200 individual texture maps. 

### Customization

You’ll notice you can’t access the site until a passcode is entered. This is not just a cosmetic popup that can be cancelled or removed, the entire site content (3D and 2D) will not render until react's state receives a correct passcode variable via the setPasscode method. The current list of passcodes lives in the [config.json](https://github.com/DaveSeidman/jenstark/blob/main/config.json) file, refer to it for access. Each time you enter a successful passcode, it's stored in your browsers localStorage. You can clear it manually via devtools, or by adding ?clearPasscode to the querystring. (ex: localhost:8080/?clearPasscode, la.cascadeshow.com/?clearPasscode).

Instead of maintaining several codebases or scene files for each client, we use a passcode system to decide which objects to display based on a naming system in Blender. Any object with the word “_passcodes” will be considered so if you’d like an object to appear in a scene for only certain passcodes, name the object then append the string "_passcodes" plus whatever passcodes you’d like it to appear for. For example, if you have a couch that should only display after the user has entered the Panasonic or Epson passcode, you can name it like so: 
`Couch_passcodes_panasonic_epson`

When blender exports to a gltf, most spaces and special characters are escaped, so try to use only letters, numbers and underscores and be mindful of casing. **


### Github Actions (Pipelines)

To update the staging server (daveseidman.github.io/jenstark) simply make a push to the staging branch. It’s probably best even if you’re working alone to branch from the staging branch, do your work, push it up, and then merge it into the staging branch so that you can have interim updates without changing the live link. We also have a production server that is updated in theory by pushes to the main branch but please check with Arturo first as this pipeline may currently be broken.


### Camera System

We use two cameras in the scene, an OverviewCamera. Orthographic, positioned directly above the model facing down, and a TourCamera which rides along a path defined in Blender. This camera’s movement is driven using a custom carousel that captures scroll events as well as pointer movement (desktop and mobile). Dragging left and right on the screen will change the camera's horizontal target and dragging up and down OR scrolling will change it's target position along the path. 




#### Notes:

\* of the 102 releases of the react-three/postprocessing library there is literally only one, released two years ago, that supports both the type of SSR we want and Bloom. It took much trial and error to find so make sure you do not upgrade packages. It also has several peer-dependencies so please do not change react-three/fiber or drei version either. You can ignore the warning thrown during installation. The site will still build and run.

\** there’s the potential for improvement here using the custom Properties variable that exists on each object. You should be able to write to it from the Object Properties view in Blender and read it when traversing the three.js scene.  

## Development

### Updating Camera Path

Start by enabling the ["Curve Tools" add-on](https://docs.blender.org/manual/en/3.5/addons/add_curve/curve_tools.html). Inside the Blender scene at the very top of the hierarchy view you’ll find a Curve named _CamPath. You can add remove rotate and translate any of its handles. For the current site the z-position (up and down) remains constant at eye-level the entire time so you would only move a handle in z-space if you wanted to add stairs or have the camera duck under or climb over an object. After you’re happy with the path, make a copy of it (you can delete any old or existing copies) and convert the copy to a mesh (Object > Convert to Mesh), then switch to edit mode, go to the edit menu on the right side of the viewport and select Loop Tools, then press the "Space" tool to automatically redistribute all the vertices evenly along the curve. If you skip this step, the camera speed will not be consistent along the curve. Here is some helpful info on how to modify things like, whether the curve is cyclic, which direction it goes, and which point should be considered the first: https://blender.stackexchange.com/questions/92912/can-i-set-the-start-point-of-a-bezier-curve

After all this you can do File > Export > Export Vertices to JSON

The camera path will be hot reloaded in the scene

Updating stops along the camera path requires modifying the "pages" object in the config.json file. You'll need to do this even if you adjust the path slightly. The components/progress/index.jsx file reads the config.json file to determine the points along the path that should be labeled as rooms. 

### Image Textures

If you’ve changed or added any textures after making updates to the scene, you need to run a few scripts to reduce their sizes. Apply for a developer account here: https://tinypng.com/developers


If you've included new textures that are not in the /etc/textures folder, ex: you downloaded and imported a new model that came with it's own texture files, you can run File, External Data, Pack Resources, then File, External Data, Unpack Resources and select "current working directory / overwrite files"

Avoid using .tga or basically anything other than .jpg or .png's for browser compatability. Remember that textures are loaded outside of threejs and then shipped ot the graphics card so if a browser doesn't support a format it won't appear in the scene and may not throw an error. 


### Video Textures

This site leverages a lot of video textures, from the tv screens, projector screens and even objects like the light tunnel, we rely on off-screen video textures using react three drei’s VideoTexture. To update or add one, you need to name the material in blender to match the name of the video file in the public/videos/ folder. Include the .mp4 in the material name as that’s what triggers the codebase to swap it with a videotexture. 

Many of the videos are combined from after effects and then separated using uv mapping, this increased performance but covered with the drawback that the videos are all on the same timeline so if you pause one (we loop all videos and never pause) any other object that shares the same multi-video texture will pause. The same goes for playback speed though we are not varying that either.


### Lighting

Shadows in our scene are turned OFF to save on performance, however we still use lights for specularity and reflections. Use caution when adjusting the intensity of lights in Blender as they are not to physical scale for our scene and small changes can have drastic effects. For instance, increasing the Sun’s intensity by a few units may cause the scene to render entirely white. 

We also use tonemapping in our GL renderer, see where our Canvas is set up in src/components/scene/index.jsx

Three.js supports .hdr and .exr for environment files and we leverage those in our scene via the Drei Environment component


### Clones / Instancing

In order to save on filesize, many of the repeated objects in the blender file are only exported once into the .glb file and then in src/components/scene/model.jsx we replicate them again. There’s a script called scripts/ArrayToClones.py that you can open and run in the script editor from Blender. It will traverse your scene looking for objects with the Array modifier. A good example of this are the exterior windows which is a single window, repeated hundreds of times. Instead of all that geometry being saved to our GLB, we save it once, and then replicate it in three JS. The python script will make an “empty” at every location where a clone should appear so in order for this to work, please make sure that your object’s scale and rotation and zeroed out (apply scale and rotation) before running the scripts. And that the “apply modifiers” checkbox is OFF before exporting the model as a GLB. This allows you to see the effects of the array modifiers in the scene without having to turn them off every time you want to update the model.


### Exporting to GLTF/GLB

Here are the setting you should copy when exporting to GLB: ![gltf settings](https://lh3.googleusercontent.com/u/0/drive-viewer/AKGpihbBgp5bR4EvaY80fj6No9c0fRkG6PvbcDSshS3guup3UE8zxUVL0x4F_Q_8jevMJ1Pju2Gan6YrM6HZuRdYPkQvxvjrLbEfWw=w2192-h1978-rw-v1)


### Performance / Compatability:

We serve the same exact site for desktop and mobile browsers, and while the dpr in our Canvas is variable we’re trying to get the experience to run smoothly on all platforms. To that end: 
- Shadows are turned off
- The camera’s far plane is rather close
- Fog is applied to the scene to hide clipping near the camera’s far plane
- Video textures are small and combined
- Video texture frame rates are lowered to 24fps





