import * as THREE from "three";

// import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

// import { MindARThree } from "mindar-image-three";

import { MindARThree } from "./components/mind-ar-srgb-encoding-fix/src/image-target/three.js";

const frontCameraDeviceSelect = document.querySelector(
  "#frontCameraDeviceSelect"
);
const backCameraDeviceSelect = document.querySelector(
  "#backCameraDeviceSelect"
);

const boxThickness = 0.2;

let mindarThree = null;

const setup = () => {
  const userDeviceId = frontCameraDeviceSelect.value
    ? frontCameraDeviceSelect.value
    : undefined;
  const environmentDeviceId = backCameraDeviceSelect.value
    ? backCameraDeviceSelect.value
    : undefined;

  console.log("setup:", userDeviceId, environmentDeviceId);

  const filterMinCF = document.querySelector("#filterMinCF").value;
  const filterBeta = document.querySelector("#filterBeta").value;
  const missTolerance = document.querySelector("#missTolerance").value;
  const warmupTolerance = document.querySelector("#warmupTolerance").value;
  console.log("filterMinCF", filterMinCF);

  mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: "/target.mind",
    filterMinCF: Number(filterMinCF),
    filterBeta: Number(filterBeta),
    missTolerance: Number(missTolerance),
    warmupTolerance: Number(warmupTolerance),
    userDeviceId,
    environmentDeviceId,
  });

  // mindarThree = new MindARThree({
  //   container: document.querySelector("#container"),
  //   imageTargetSrc: "/target.mind",
  //   filterMinCF: 0.001,
  //   filterBeta: 0.001,
  //   missTolerance: 10,
  //   warmupTolerance: 10,
  //   userDeviceId,
  //   environmentDeviceId,
  // });
  const anchor = mindarThree.addAnchor(0);
  const geometry = new THREE.BoxGeometry(1, 1, boxThickness);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.z = boxThickness / 2;
  anchor.group.add(plane);
};

const restartMindarThree = () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
  console.log("changed");
  mindarThree.filterMinCF = Number(
    document.querySelector("#filterMinCF").value
  );
  mindarThree.filterBeta = Number(document.querySelector("#filterBeta").value);
  mindarThree.missTolerance = Number(
    document.querySelector("#missTolerance").value
  );
  mindarThree.warmupTolerance = Number(
    document.querySelector("#warmupTolerance").value
  );
  start();
};

// if filterMinCF, filterBeta, missTolerance, warmupTolerance changed, restart mindarThree
const filterMinCF = document.querySelector("#filterMinCF");
filterMinCF.addEventListener("change", restartMindarThree);
const filterBeta = document.querySelector("#filterBeta");
filterBeta.addEventListener("change", restartMindarThree);
const missTolerance = document.querySelector("#missTolerance");
missTolerance.addEventListener("change", restartMindarThree);
const warmupTolerance = document.querySelector("#warmupTolerance");
warmupTolerance.addEventListener("change", restartMindarThree);

const start = async () => {
  if (!mindarThree) {
    setup();
  }
  const { renderer, scene, camera } = mindarThree;
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  start();
});

const stopButton = document.querySelector("#stopButton");
stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
});

const switchButton = document.querySelector("#switchButton");
switchButton.addEventListener("click", () => {
  mindarThree.switchCamera();
});

navigator.mediaDevices
  .enumerateDevices()
  .then(function (devices) {
    devices.forEach(function (device) {
      console.log("device", device);

      if (device.kind === "videoinput") {
        const option = document.createElement("option");
        option.text =
          device.label || "camera " + frontCameraDeviceSelect.length;
        option.value = device.deviceId;

        const option2 = document.createElement("option");
        option2.text =
          device.label || "camera " + backCameraDeviceSelect.length;
        option2.value = device.deviceId;

        frontCameraDeviceSelect.appendChild(option);
        backCameraDeviceSelect.appendChild(option2);
      }

      console.log(
        device.kind + ": " + device.label + " id = " + device.deviceId
      );
    });
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });

// const mindarThree = new MindARThree({
//   container: document.querySelector("#container"),
//   imageTargetSrc:
//     "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind",
// });
// const { renderer, scene, camera } = mindarThree;
// const anchor = mindarThree.addAnchor(0);
// const geometry = new THREE.PlaneGeometry(1, 0.55);
// const material = new THREE.MeshBasicMaterial({
//   color: 0x00ffff,
//   transparent: true,
//   opacity: 0.5,
// });
// const plane = new THREE.Mesh(geometry, material);
// anchor.group.add(plane);
// const start = async () => {
//   await mindarThree.start();
//   renderer.setAnimationLoop(() => {
//     renderer.render(scene, camera);
//   });
//   console.log("started");
// };
// const startButton = document.querySelector("#startButton");
// const stopButton = document.querySelector("#stopButton");
// startButton.addEventListener("click", () => {
//   console.log("start");
//   start();
// });
// stopButton.addEventListener("click", () => {
//   mindarThree.stop();
//   mindarThree.renderer.setAnimationLoop(null);
// });
