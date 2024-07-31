const teleprompterForm = document.getElementById("teleprompterForm");
const draft = document.getElementById("draft");


teleprompterForm.addEventListener("submit", (event) => {
    let text = draft.value.trim();
    if (text === '') {
        alert('请输入文本内容');
        event.preventDefault();
    } else {
        sessionStorage.setItem("draft", text);
        window.open("teleprompter.html")
    }

})
