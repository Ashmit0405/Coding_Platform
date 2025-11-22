import {execSync} from "child_process"

const image_build=()=>{
    const images=[
        {"Image":"gcc-gnu:latest","DockerFile":"./backend/public/images/Dockerfile.cpp"},
        {"Image":"java-gnu:17-slim","DockerFile":"./backend/public/images/Dockerfile.java"},
        {"Image":"py-gnu:3.11","DockerFile":"./backend/public/images/Dockerfile.python"},
        {"Image":"node:22","DockerFile":"./backend/public/images/Dockerfile.js"}
    ]

    for(let i=0;i<images.length;i++){
        console.log(`Building the image ${images[i].Image}`);
        execSync(`docker build -t ${images[i].Image} -f ${images[i].DockerFile} .`,{stdio: "inherit"});
    }
    console.log("Images Built Successfully");
}

image_build();