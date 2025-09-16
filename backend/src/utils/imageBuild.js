import {execSync} from "child_process"

const image_build=()=>{
    const images=[
        {"Image":"gcc-gnu","DockerFile":"/home/ashmit-singh/projects/Coding_Platform/backend/public/images/Dockerfile.cpp"},
        {"Image":"java-gnu","DockerFile":"//home/ashmit-singh/projects/Coding_Platform/backend/public/images/Dockerfile.java"},
        {"Image":"py-gnu","DockerFile":"/home/ashmit-singh/projects/Coding_Platform/backend/public/images/Dockerfile.python"},
        {"Image":"js-gnu","DockerFile":"/home/ashmit-singh/projects/Coding_Platform/backend/public/images/Dockerfile.js"}
    ]

    for(let i=0;i<images.length;i++){
        console.log(`Building the image ${images[i].Image}`);
        execSync(`docker build -t ${images[i].Image} -f ${images[i].DockerFile} .`,{stdio: "inherit"});
    }
    console.log("Images Built Successfully");
}

export {image_build};