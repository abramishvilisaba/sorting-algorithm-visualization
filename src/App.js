import React, { useEffect, useState, useRef } from "react";
// import Navbar from "./components/Navbar";

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(15);
  const [width, setWidth] = useState(6);
  const [selectedSpeed, setSelectedSpeed] = useState(100);
  const [speed, setSpeed] = useState(50);
  const [active, setActive] = useState(false);
  const [minHeight, setMinHeight] = useState(100);
  const [maxHeight, setMaxHeight] = useState(850);
  const [selectedMinHeight, setSelectedMinHeight] = useState(100);
  const [selectedMaxHeight, setSelectedMaxHeight] = useState(850);
  const [selectedWidth, setSelectedWidth] = useState(700);
  const [displaySwitch, setDisplaySwitch] = useState("columns");

  const colors1 = ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"];
  const colors2 = ["#0096c7", "#0096c7", "#48cae4"];
  const colors3 = ["#ccdbfd", "#c1d3fe", "#b6ccfe"];
  const colors4 = ["#e0c3fc", "#bbadff", "#dab6fc", "#ddbdfc"];
  const colors5 = ["#00a9e2"];
  const selectedColors = colors5;
  const colorI = "#2166b0";
  const colorISwap = "#173A80";
  const colorJ = "#2166b0";
  const colorJSwap = "#173A80";
  //#173A80
  //#2A177F
  const colorIndex = "#3083DC";
  const colorPivot = "#4B56D2";
  const minSize = 10;
  const maxSize = 100;
  const minSpeed = 10;
  const maxSpeed = 200;
  const height = 850;
  const width1 = 900;
  const width2 = 1200;

  // https://codingbeautydev.com/blog/react-get-window-width-height/
  // https://github.com/CodingTrain/Coding-Challenges/tree/2a9d68112b1aa80cbd5aa303f1d97dda7b045fde/143_QuickSort
  console.log("-------------------------------------");
  // console.log(windowSize[0]);
  // console.log(speed);
  // console.log(array);

  console.log("------------------");

  useEffect(() => {
    // setSpeed(
    //   (maxSpeed - selectedSpeed) / ((size / 100) * (size / 100) * (size / 100))
    // );
    // setSpeed((maxSpeed - selectedSpeed) / ((size / 50) * (size / 50)));
    setSpeed((maxSpeed - selectedSpeed) / (size / 50));
  }, [selectedSpeed, size]);
  //
  useEffect(() => {
    let max = parseFloat(selectedMaxHeight);
    let min = parseFloat(selectedMinHeight);

    if (selectedMaxHeight > selectedMinHeight) {
      console.log("===============================================");

      if (min < 0) {
        max = max - min;
        min = min - min;
      }
      let num = max / height;
      setMinHeight(min / num);
      setMaxHeight(max / num);
    } else if (selectedMaxHeight < selectedMinHeight) {
    }
  }, [selectedMinHeight, selectedMaxHeight]);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function randNum(lo, hi) {
    return Math.floor(Math.random() * (hi - lo + 1) + lo);
  }
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize]);
  useEffect(() => {
    if (windowSize[0] >= 1000) setSelectedWidth(width1);
    else if (windowSize[0] < 1000) {
      setSelectedWidth(width2);
    }
  }, [windowSize]);

  const widthRatio = windowSize[0] / 1920;
  const heightRatio = windowSize[1] / 1080;

  async function fillArr() {
    // await sleep(1000);
    const array = [];
    for (let i = 0; i < size; i++) {
      array.push(randNum(minHeight, maxHeight));
    }
    setArray([]);
    setArray(array);
  }
  async function fillArr2() {
    // await sleep(1000);
    const array = [];
    for (let i = 0; i < size; i++) {
      array.push(randNum(selectedMinHeight, selectedMaxHeight));
    }
    setArray([]);
    setArray(array);
  }
  useEffect(() => {
    fillArr2();
  }, [selectedMaxHeight]);

  useEffect(() => {
    fillArr2();
  }, [size]);
  //
  async function colorChange(position, color, revert = true) {
    if (document.getElementById(position) !== null) {
      if (document.getElementById(position).style !== null) {
        let bar = document.getElementById(position).style;
        if (bar !== "") {
          bar.backgroundColor = color;
          // bar.borderColor = "blue";
        }
        if (revert === true) {
          await sleep(speed);
          bar.backgroundColor = selectedColors;
        }
      }
    }
  }

  async function swap(items, leftIndex, rightIndex) {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
  }
  async function partition(items, left, right) {
    var rand = Math.floor((right + left) / 2);
    var pivot = items[rand];
    var i = left;
    var j = right;
    await colorChange(rand, colorPivot, false);
    await Promise.all([
      colorChange(i, colorI, true),
      colorChange(j, colorJ, true),
    ]);
    while (i <= j) {
      while (items[i] < pivot) {
        console.log("pivot ====== " + pivot);
        await colorChange(rand, colorPivot, false);
        await colorChange(i, colorI, true);
        i++;
      }
      while (items[j] > pivot) {
        console.log("pivot ====== " + pivot);
        await colorChange(rand, colorPivot, false);
        await colorChange(j, colorJ, true);
        j--;
      }
      await Promise.all([
        colorChange(i, colorI, true),
        colorChange(j, colorJ, true),
      ]);

      if (i <= j) {
        await swap(items, i, j);

        if (i === rand) {
          rand = j;
        } else if (j === rand) {
          rand = i;
        }
        await colorChange(rand, colorPivot, false);

        await Promise.all([
          colorChange(i, colorISwap, true),
          colorChange(j, colorJSwap, true),
        ]);

        i++;
        j--;
        await sleep(speed);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        let fullArr = [];
        fullArr = [...array, items];
        if (fullArr.length > items.length) {
          fullArr.pop();
        }

        setArray(fullArr);
      }
    }
    await colorChange(rand, selectedColors, true);
    return i;
  }

  async function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
      console.log("gooooo");
      index = await partition(items, left, right); //index returned from partition
      if (left < index - 1) {
        //more elements on the left side of the pivot
        quickSort(items, left, index - 1);
      }
      if (index < right) {
        //more elements on the right side of the pivot
        quickSort(items, index, right);
      }
    }
    // console.log(items);
    return items;
  }
  async function bubbleSort(arr) {
    var i, j;
    var len = arr.length;

    var isSwapped = false;

    for (i = 0; i < len; i++) {
      isSwapped = false;

      for (j = 0; j < len; j++) {
        await Promise.all([
          colorChange(j, colorI, true),
          // colorChange(j, colorJSwap, true),
        ]);
        if (arr[j] > arr[j + 1]) {
          // await Promise.all([
          //   colorChange(j, colorI, true),
          //   // colorChange(j, colorJSwap, true),
          // ]);

          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          isSwapped = true;
          await Promise.all([
            colorChange(j + 1, colorISwap, true),
            colorChange(j, colorJSwap, true),
          ]);
          // await sleep(1000);
          let fullArr = [];
          fullArr = [...array, arr];
          if (fullArr.length > arr.length) {
            fullArr.pop();
          }

          setArray(fullArr);
        }
      }

      // IF no two elements were swapped
      // by inner loop, then break
      if (!isSwapped) {
        break;
      }
    }
  }

  // https://www.geeksforgeeks.org/bubble-sort-algorithms-by-using-javascript/

  // function render() {
  //   return (
  //     <div
  //       class={
  //         "w-screen min-w-max   h-fit pt-8 pb-8 lg:pt-[5%] lg:pb-24 bg-sky-100  flex flex-row items-end justify-center"
  //       }
  //       style={{ paddingTop: `${100 * (windowSize[1] / 1080)}px` }}
  //     >
  //       {array.map((value, id) => (
  //         <div
  //           className="array-bar"
  //           id={id}
  //           key={id}
  //           style={{
  //             backgroundColor: selectedColors[id % selectedColors.length],
  //             height: `${(value * windowSize[1]) / 1080}px`,
  //             // height: "50px",
  //             width: `${((selectedWidth / size) * windowSize[0]) / 1920}px`,
  //             margin: `0px ${((700 / size / 2) * windowSize[0]) / 1920}px`,
  //           }}
  //           // class={" bg-black"}
  //         >
  //           {value}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  function render2() {
    return (
      <div
        class={
          "w-screen box-border  min-h-[90%] h-fit pt-0 sm:pt-[10%] pb-36 md:pb-24 bg-sky-100  flex flex-row items-end justify-center align-middle"
        }
        style={{
          // paddingBottom: `${100 * (windowSize[1] / 1080)}px`,
          // paddingTop: `${100 * (windowSize[1] / 1080)}px`,

          alignItems: displaySwitch === "cells" ? "center" : "end",
        }}
      >
        {array.map((value, id) => (
          <div
            className="array-bar"
            id={id}
            key={id}
            // style={{
            //   backgroundColor: selectedColors[id % selectedColors.length],
            //   height: `${(value * windowSize[1]) / 1080}px`,
            //   // height: "50px",
            //   width: `${((selectedWidth / size) * windowSize[0]) / 1920}px`,
            //   margin: `0px ${((700 / size / 2) * windowSize[0]) / 1920}px`,
            // }}
            class={
              " bg-white h-16 w-16 flex justify-center items-start text-white border-solid border-sky-700 border-2"
            }
            style={
              displaySwitch === "columns"
                ? {
                    backgroundColor: selectedColors[id % selectedColors.length],
                    // height: `${value * heightRatio}px`,
                    height: `${
                      selectedMaxHeight > selectedMinHeight
                        ? (value / (selectedMaxHeight / 750)) * heightRatio
                        : (value / (selectedMinHeight / 750)) * heightRatio
                    }px`,
                    // height: "50px",
                    width: `${
                      size >= 20
                        ? (selectedWidth / size) * widthRatio
                        : (selectedWidth / size) * widthRatio
                    }px`,
                    margin: `0px ${(700 / size / 3) * widthRatio}px`,
                    fontSize: `${(350 / size) * widthRatio}px`,
                  }
                : {
                    backgroundColor: selectedColors[id % selectedColors.length],
                    height: `${(1000 / size) * widthRatio}px`,
                    // height: "50px",
                    width: `${
                      size >= 20
                        ? (width2 / size) * widthRatio
                        : (width2 / size) * widthRatio
                    }px`,
                    margin: `0px ${(300 / size / 3) * widthRatio}px`,
                    alignItems: "center",
                    fontSize: `${(350 / size) * widthRatio}px`,
                  }
            }
            // style={{
            //   backgroundColor: selectedColors[id % selectedColors.length],
            // }}
          >
            {size <= 30 ? value : null}
          </div>
        ))}
      </div>
    );
  }

  //
  async function start(arr, lo, hi) {
    setActive(true);
    await sleep(100);
    await quickSort(arr, lo, hi);
    setActive(false);
  }
  async function changeSpeed(e) {
    if (!active) {
      setSelectedSpeed(e.target.value);
    }
  }
  async function changeSize(e) {
    if (!active) {
      setSize(e.target.value);
    }
  }
  async function newArr() {
    if (!active) {
      fillArr2();
    }
  }

  async function changeMinHeight(e) {
    if (!active) {
      setSelectedMinHeight(e.target.value);
      let num = Math.floor(parseFloat(e.target.value));
      if (Number.isInteger(num)) {
        setSelectedMinHeight(num);
      }
    }
  }
  async function changeMaxHeight(e) {
    if (!active) {
      setSelectedMaxHeight(e.target.value);
      let num = Math.floor(parseFloat(e.target.value));
      if (Number.isInteger(num)) {
        setSelectedMaxHeight(num);
      }
    }
  }

  function NavBar() {
    return (
      <div
        class={
          " h-fit min-h-20 w-[100%] py-4  xl:py-4   bg-[#334F7F] flex flex-row justify-center flex-wrap gap-0  sm:gap-4"
        }
      >
        {/* row1 */}
        <div class={"flex justify-between  mx-4 w-fit sm:w-fit gap-2 md:gap-4"}>
          <div class={" navBarContainer gap-2"}>
            <div>
              <input
                type="radio"
                id="columns"
                name="displaySelector"
                value="columns"
                onChange={(e) => {
                  setDisplaySwitch(e.target.value);
                }}
                checked={displaySwitch === "columns"}
              />
              <label for="columns" class={"mr-2 ml-1"}>
                columns
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="cells"
                name="displaySelector"
                value={"cells"}
                onChange={(e) => {
                  setDisplaySwitch(e.target.value);
                }}
                checked={displaySwitch === "cells"}
              />
              <label for="cells" class={"mr-2 ml-1 "}>
                cells
              </label>
            </div>
          </div>
          <div class={"navBarContainer text-xl font-semibold gap-2 "}>
            <p> Interval</p>
            <div class="flex flex-row">
              <input
                type="input"
                // placeholder="100"
                defaultValue={100}
                class={
                  "input"
                  // " mr-1 py-1 hover:cursor-pointer max-w-fit w-12 sm:w-16 bg-[#54BAB9] border-solid border-white border-2  rounded-sm outline-none text-base text-center"
                }
                value={selectedMinHeight}
                onChange={(e) => {
                  changeMinHeight(e);
                }}
              ></input>
              <p class="mx-1"> -</p>

              <input
                type="input"
                // placeholder="850"
                defaultValue={850}
                class={
                  "input"
                  // " ml-1 py-1 hover:cursor-pointer max-w-fit w-12 sm:w-16  bg-[#54BAB9] border-solid border-white border-2  rounded-sm outline-none text-base text-center"
                }
                value={selectedMaxHeight}
                onChange={(e) => {
                  changeMaxHeight(e);
                }}
              ></input>
            </div>
          </div>
          <button class={"button"} onClick={() => newArr()}>
            New Array
          </button>
        </div>
        {/* row2 */}
        <div
          class={
            "flex pt-2 sm:pt-0 justify-between mx-4 w-fit sm:w-fit gap-2 md:gap-4"
          }
        >
          <div class={"navBarContainer flex mx-0 flex-row items-center  "}>
            <p class="mr-2">size</p>
            <input
              type="range"
              placeholder="hehe"
              min={minSize}
              max={maxSize}
              step="1"
              class={"mx-0 hover:cursor-pointer w-20 xl:w-28"}
              value={size}
              onChange={(e) => changeSize(e)}
            ></input>
          </div>
          <div class={" navBarContainer flex mx-0 flex-row items-center  "}>
            <p class="mr-2">speed</p>
            <input
              type="range"
              placeholder="hehe"
              min={minSpeed}
              max={maxSpeed}
              step="1"
              class={"mx-0 hover:cursor-pointer w-20 xl:w-28"}
              value={selectedSpeed}
              onChange={(e) => {
                changeSpeed(e);
                // setSelectedSpeed(e.target.value)
              }}
            ></input>
          </div>
          <div class={"navBarContainer flex mx-0 flex-row items-center  "}>
            <button
              class={"button"}
              onClick={() => {
                start(array, 0, array.length - 1);
                //quickSort(array, 0, array.length - 1);
              }}
            >
              Quick Sort
            </button>
          </div>
          <div class={"navBarContainer flex mx-0 flex-row items-center  "}>
            <button
              class={"button"}
              onClick={() => {
                bubbleSort(array);
                //quickSort(array, 0, array.length - 1);
              }}
            >
              Bubble Sort
            </button>
          </div>
        </div>
      </div>
    );
  }
  // const buttonStyle = "navBarContainer p-2 border-2";
  // const navBarContainer=""
  // .navBarContainer {
  //   color: white;
  //   font-size: 1.125rem /* 18px */;
  //   line-height: 1.75rem /* 28px */;
  //   font-weight: 500;
  //   display: flex;
  //   flex-wrap: wrap;
  //   justify-content: center;
  //   align-items: center;
  // }

  return (
    <div class={"w-screen flex flex-col h-screen bg-sky-100 box-border"}>
      {NavBar()}
      {render2()}
    </div>
  );
}
