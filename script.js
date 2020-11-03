// const showRulesButton = document.getElementById('toggleID');






const toggle = document.getElementById('toggle');
document.body.classList.toggle('show-nav');
document.body.classList.toggle('change');

toggle.addEventListener('click', ()=> {
    document.body.classList.toggle('show-nav');
    document.body.classList.toggle('change');
}
);


const toggleV = document.getElementById('toggleV');
toggleV.addEventListener('click', ()=> {
    document.body.classList.toggle('show-nav');
    document.body.classList.toggle('change');
}
);