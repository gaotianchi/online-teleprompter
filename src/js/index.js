const teleprompterForm = document.getElementById("teleprompterForm");
const draft = document.getElementById("draft");


teleprompterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let text = draft.value.trim();
    if (text === '') {
        alert('请输入文本内容');
    } else {
        sessionStorage.setItem("draft", text);
        window.location.href = "teleprompter.html"
    }

})
