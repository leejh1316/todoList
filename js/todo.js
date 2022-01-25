const todoAddBtn = document.querySelector(".todoAddBtn");
const dataInner = document.querySelector(".dataInner");
const dataInnerCon = document.querySelector(".dataInnerCon");
const titleInput = document.querySelector(".titleInput");
const startDate = document.querySelector(".startDate");
const finishDate = document.querySelector(".finishDate");
const progressInput = document.getElementsByName("progressInput");
const inputTextarea = document.querySelector(".inputTextarea");
const cancelBtn = document.querySelector(".cancelBtn");
const finishBtn = document.querySelector(".finishBtn");
const tableRowInner = document.querySelector(".tableRowInner");
//삭제
const deleteCon = document.querySelector(".deleteCon");
const deleteOkBtn = document.querySelector(".deleteOkBtn");
const deleteNoBtn = document.querySelector(".deleteNoBtn");
let progressCheck;

//애니메이션 추가 삭제
todoAddBtn.addEventListener("click", function () {
  finishBtn.addEventListener("click", addTodoListEvent);
  fadeIn();
});
cancelBtn.addEventListener("click", function () {
  fadeOut();
  valueInit();
});

//폼에 있던 값들 초기화
function valueInit() {
  titleInput.value = "";
  startDate.value = "";
  finishDate.value = "";
  inputTextarea.value = "";
  progressInput.forEach(function (radio) {
    radio.checked = false;
  });
}
//중복제거용
function fadeIn() {
  dataInnerCon.classList.remove("zIndexOut");
  dataInner.classList.remove("fadeOut");
  dataInnerCon.classList.add("zIndexIn");
  dataInner.classList.add("fadeIn");
}
function fadeOut() {
  dataInnerCon.classList.remove("zIndexIn");
  dataInner.classList.remove("fadeIn");
  dataInnerCon.classList.add("zIndexOut");
  dataInner.classList.add("fadeOut");
}

//확인버튼 클릭시 이벤트 처리
function addTodoListEvent(e) {
  e.preventDefault();
  progressInput.forEach(function (radio) {
    if (radio.checked) {
      progressCheck = radio.value;
    }
  });
  if (
    titleInput === "" ||
    progressCheck === undefined ||
    startDate.value === ""
  ) {
    alert("제목과 시작일 진행상황을 입력하세요.");
  } else {
    //애니메이션 추가
    dataInnerCon.classList.remove("zIndexIn");
    dataInner.classList.remove("fadeIn");
    dataInnerCon.classList.add("zIndexOut");
    dataInner.classList.add("fadeOut");
    //엘리먼트 추가
    const createList = document.createElement("li");
    const createDetails = document.createElement("details");
    const createSummary = document.createElement("summary");
    const createP = document.createElement("p");
    const createDivTitle = document.createElement("div");
    const createDivDate = document.createElement("div");
    const createDivProgress = document.createElement("div");
    const createDivManagement = document.createElement("div");
    const createBtnDelete = document.createElement("button");
    const createBtnEdit = document.createElement("button");
    createDivTitle.innerHTML = `${titleInput.value}`;
    createDivDate.innerHTML = `${startDate.value} / ${finishDate.value}`;
    createDivProgress.innerHTML = `${progressCheck}`;
    createBtnEdit.classList.add("editBtn");
    createBtnDelete.classList.add("deleteBtn");
    createBtnEdit.addEventListener("click", editButtonEvent);
    createBtnDelete.addEventListener("click", removeEvent);
    createBtnEdit.innerText = `🔧`;
    createBtnDelete.innerText = `❌`;
    createDivManagement.append(createBtnEdit);
    createDivManagement.append(createBtnDelete);
    createP.innerHTML = `${inputTextarea.value.replace(/(\n|\r\n)/g, "<br>")}`;
    createSummary.append(createDivTitle);
    createSummary.append(createDivDate);
    createSummary.append(createDivProgress);
    createSummary.append(createDivManagement);
    createDetails.append(createSummary);
    createDetails.append(createP);
    createList.append(createDetails);
    tableRowInner.append(createList);
    valueInit();
  }
}
//추가된 버튼 이벤트 추가 + 기존정보 표시
function editButtonEvent(e) {
  //확인 버튼으로 수정하기 위해 기존에 있던 이벤트 삭제
  finishBtn.removeEventListener("click", addTodoListEvent);
  let startDateText;
  let finishDateText;
  const children = e.target.parentElement.parentElement.children;
  fadeIn();
  //전역변수
  titleEdit = children[0];
  dateEdit = children[1];
  progressEdit = children[2];
  textEdit = e.target.parentElement.parentElement.parentElement.children[1];
  //시작일 종료일 문자열 자르기
  if (children[1].innerHTML.length < 14) {
    startDateText = children[1].innerHTML.slice(0, 10);
    finishDateText = "";
  } else if (
    children[1].innerHTML.length > 14 &&
    children[1].innerHTML.length < 24
  ) {
    startDateText = children[1].innerHTML.slice(0, 10);
    finishDateText = children[1].innerHTML.slice(13, 24);
  }
  // 오브젝트에 정리
  const newEditObj = {
    title: children[0].innerHTML,
    start: startDateText,
    finish: finishDateText,
    progress: children[2].innerHTML,
    text: e.target.parentElement.parentElement.parentElement.children[1]
      .innerHTML,
  };
  //기존 정보 표시
  titleInput.value = newEditObj.title;
  startDate.value = newEditObj.start;
  finishDate.value = newEditObj.finish;
  progressInput.forEach(function (e) {
    if (e.value === newEditObj.progress) {
      e.checked = true;
    }
  });
  inputTextarea.value = newEditObj.text;
  finishBtn.addEventListener("click", editFinishButtonEvent);
}
//확인버튼 -> 수정버튼 이벤트
function editFinishButtonEvent(e) {
  e.preventDefault();
  finishBtn.removeEventListener("click", editFinishButtonEvent);
  titleEdit.innerHTML = `${titleInput.value}`;
  dateEdit.innerHTML = `${startDate.value} / ${finishDate.value}`;
  progressEdit.innerHTML = `${prog()}`;
  textEdit.innerHTML = `${inputTextarea.value}`;
  fadeOut();
  valueInit();
}

//중복제거용
function prog() {
  progressInput.forEach(function (radio) {
    if (radio.checked) {
      progressCheck = radio.value;
    }
  });
  return progressCheck;
}

function removeEvent(e) {
  deleteCon.classList.remove("delFadeOut");
  deleteCon.classList.add("delFadeIn");
  deleteElement =
    e.target.parentElement.parentElement.parentElement.parentElement;
}
function deleteOkEvent(e) {
  deleteElement.remove();
  deleteCon.classList.remove("delFadeIn");
  deleteCon.classList.add("delFadeOut");
}
function deleteNoEvent() {
  deleteCon.classList.remove("delFadeIn");
  deleteCon.classList.add("delFadeOut");
}

deleteOkBtn.addEventListener("click", deleteOkEvent);
deleteNoBtn.addEventListener("click", deleteNoEvent);
