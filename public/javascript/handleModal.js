const btnMembership = document.querySelector("#btn-membership");
const btnCancel = document.querySelector("#btn-cancel");
const modalBackground = document.querySelector(".modal-background");

function onClickBtnMembership(event) {
    console.log("Membership btn clicked!");
    modalBackground.classList.remove("modal-show");
    modalBackground.classList.add("modal-show");
}

function onClickBtnCancel(event) {
    modalBackground.classList.remove("modal-show");
}

btnMembership.addEventListener("click", onClickBtnMembership);
btnCancel.addEventListener("click", onClickBtnCancel);