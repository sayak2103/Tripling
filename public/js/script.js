// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  //this entire code snippet is to facilitate the filter options in the home page
  let filters=document.querySelectorAll(".filter");//all the checkbox inputs
    filters.forEach((filter)=>{
        filter.addEventListener("input",()=>{       //for every filter when clicked
            let box=document.getElementsByClassName(`${filter.name}`)[0]; //the label of that filter
            let catg=document.querySelectorAll(".categories");      //the undisplayed <p> of every listing
            if(filter.checked){
                box.classList.add("selected-filter");
                box.firstElementChild.lastElementChild.classList.add("selected-filter");
                catg.forEach((element)=>{
                if(element.innerText.indexOf(filter.name)<0){
                        element.parentElement.classList.add("display-none");
                    }
                });
            }
            else{
                catg.forEach((element)=>{
                    let i=0;
                    filters.forEach((felement)=>{
                        if(felement.checked && element.innerText.indexOf(felement.name)<0)
                            i++;
                    })
                    if(i==0){
                        element.parentElement.classList.remove("display-none");
                    }
                });
                box.classList.remove("selected-filter");
                box.firstElementChild.lastElementChild.classList.remove("selected-filter");
            }
        })
    });