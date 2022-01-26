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
// localStorage
let todos = [];
const TODOS_KEY = "todoList";
//로컬 스토리지 저장 함수
function saveTodoList() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos)); //setItem("Key", "array") 문자열로 저장됨, [1,2,3] -> "1,2,3", JSON.stringify([1,2,3]) ->[1,2,3]
}

//애니메이션 추가 삭제
todoAddBtn.addEventListener("click", function () {
  finishBtn.addEventListener("click", addTodoListEvent);
  fade.in();
});
cancelBtn.addEventListener("click", function () {
  fade.out();
  valueInit();
});

//[폼 값 초기화]
function valueInit() {
  titleInput.value = "";
  startDate.value = "";
  finishDate.value = "";
  inputTextarea.value = "";
  progressInput.forEach(function (radio) {
    radio.checked = false;
  });
}
//[애니메이션 중복 제거]
const fade = {
  in: function () {
    dataInnerCon.classList.remove("zIndexOut");
    dataInner.classList.remove("fadeOut");
    dataInnerCon.classList.add("zIndexIn");
    dataInner.classList.add("fadeIn");
  },
  out: function () {
    dataInnerCon.classList.remove("zIndexIn");
    dataInner.classList.remove("fadeIn");
    dataInnerCon.classList.add("zIndexOut");
    dataInner.classList.add("fadeOut");
  },
};

//확인버튼 클릭시 이벤트 처리
function addTodoListEvent(e) {
  e.preventDefault();
  progressInput.forEach(function (radio) {
    if (radio.checked) {
      progressCheck = radio.value;
    }
  });
  if (
    titleInput.value === "" ||
    progressCheck === undefined ||
    startDate.value === ""
  ) {
    alert("제목과 시작일 진행상황을 입력하세요.");
  } else {
    const newTodoObj = {
      id: Date.now(),
      title: titleInput.value,
      date: `${startDate.value} / ${finishDate.value}`,
      progress: progressCheck,
      text: inputTextarea.value,
    };
    fade.out();
    todos.push(newTodoObj);
    printList(newTodoObj);
    saveTodoList();
    valueInit();
  }
}
// [수정버튼] ,추가된 버튼 이벤트 추가 + 기존정보 표시
function editButtonEvent(e) {
  console.dir(e);
  console.dir(e.target.parentElement.parentElement.parentElement.parentElement);
  //확인 버튼으로 수정하기 위해 기존에 있던 이벤트 삭제
  finishBtn.removeEventListener("click", addTodoListEvent);
  let startDateText;
  let finishDateText;
  const children = e.target.parentElement.parentElement.children; //summary 요소의 자식들
  fade.in();
  //전역변수
  titleEdit = children[0];
  dateEdit = children[1];
  progressEdit = children[2];
  textEdit = e.target.parentElement.parentElement.parentElement.children[1]; // li요소 자식의 [1]번째 요소
  //로컬 스토리지 수정에 쓰일 인덱스값 찾기
  editFindIndex = todos.findIndex(
    (x) =>
      x.id ===
      parseInt(
        e.target.parentElement.parentElement.parentElement.parentElement.id //li요소의 id값
      )
  );

  if (children[1].innerHTML.length < 14) {
    //시작일 종료일 문자열 자르기
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
      .innerText,
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
  textEdit.innerHTML = `${inputTextarea.value.replace(/(\n|\r\n)/g, "<br>")}`;
  //todos에서 찾은 list Id값으로 로컬 저장소 값 수정
  todos[editFindIndex].title = `${titleInput.value}`;
  todos[editFindIndex].date = `${startDate.value} / ${finishDate.value}`;
  todos[editFindIndex].progress = `${prog()}`;
  todos[editFindIndex].text = `${inputTextarea.value}`;
  saveTodoList();
  fade.out();
  valueInit();
}

//중복제거용 라디오 체크값 찾기
function prog() {
  progressInput.forEach(function (radio) {
    if (radio.checked) {
      progressCheck = radio.value;
    }
  });
  return progressCheck;
}

//삭제버튼 함수들
function removeEvent(e) {
  deleteCon.classList.remove("delFadeOut");
  deleteCon.classList.add("delFadeIn");
  deleteElement =
    e.target.parentElement.parentElement.parentElement.parentElement; //부모 : li
}

function deleteOkEvent(e) {
  todos = todos.filter((todoID) => todoID.id !== parseInt(deleteElement.id));
  deleteElement.remove();
  deleteCon.classList.remove("delFadeIn");
  deleteCon.classList.add("delFadeOut");
  saveTodoList();
}
function deleteNoEvent() {
  deleteCon.classList.remove("delFadeIn");
  deleteCon.classList.add("delFadeOut");
}

deleteOkBtn.addEventListener("click", deleteOkEvent);
deleteNoBtn.addEventListener("click", deleteNoEvent);

//테이블에 입력된 값 표시, 로컬 스토리지에 저장된 값 표시
function printList(newTodo) {
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
  createDivTitle.innerHTML = `${newTodo.title}`;
  createDivDate.innerHTML = `${newTodo.date}`;
  createDivProgress.innerHTML = `${newTodo.progress}`;
  createBtnEdit.classList.add("editBtn");
  createBtnDelete.classList.add("deleteBtn");
  createBtnEdit.addEventListener("click", editButtonEvent);
  createBtnDelete.addEventListener("click", removeEvent);
  createBtnEdit.innerText = `🔧`;
  createBtnDelete.innerText = `❌`;
  createDivManagement.append(createBtnEdit, createBtnDelete);
  createP.innerHTML = `${newTodo.text.replace(/(\n|\r\n)/g, "<br>")}`;
  createSummary.append(
    createDivTitle,
    createDivDate,
    createDivProgress,
    createDivManagement
  );
  createDetails.append(createSummary, createP);
  createList.append(createDetails);
  createList.id = newTodo.id;
  tableRowInner.append(createList);
}

//로컬 스토리지에 값이 있다면 printList 호출
const getItmes = localStorage.getItem(TODOS_KEY);
if (getItmes) {
  const todoPrint = JSON.parse(getItmes); // 문자열 -> 배열 형태로 변경
  todos = todoPrint; // todos의 초기값은 [] 이기 때문에 저장된 값이 있다면 불러옴
  todoPrint.forEach(printList);
}
