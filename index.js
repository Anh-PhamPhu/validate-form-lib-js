function Validator(options){
    const selectorRules = {};

    function validate(inputElement, rule){
        const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        const rules = selectorRules[rule.selector];
        console.log(rules)
        for(var i = 0; i < rules.length; i++){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage

    }
    const formElement = document.querySelector(options.form);
    formElement.onsubmit = function(e){
        e.preventDefault();
        let isFormValid = true;
        options.rules.forEach((rule) =>{
            const inputElement = formElement.querySelector(rule.selector);
            let isValid = validate(inputElement, rule);
            if(!isValid){
                isFormValid = false;
            }
        })
        if(isFormValid){
            if(typeof options.onSubmit === 'function'){
                let enableInputs = formElement.querySelectorAll('[name');
                var formValues = Array.from(enableInputs).reduce((values, index) =>{
                    return (values[input.name] = input.value) && values;
                },{})
            }
            options.onSubmit(formValues)
        }else{
            formElement.onsubmit = function(e){
                e.preventDefault()
            };
        }
    }
    if(formElement){
        options.rules.forEach((rule) =>{

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            
            const inputElement = document.querySelector(rule.selector)
            if(inputElement){
                inputElement.onblur = function(e){
                    validate(inputElement, rule);
                }
                inputElement.oninput = function(){
                    const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    inputElement.parentElement.classList.remove('invalid');
                    errorElement.innerText = "";
                }
            }
        })
    }
    // console.log(selectorRules)
    
}

Validator.isRequired = function(selector){
    return {
        selector,
        test(value){
            return value.trim() ? undefined : 'Vui l??ng nh???p tr?????ng n??y';
        }
    }
}
Validator.isEmail = function(selector){
    return {
        selector,
        test(value){
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Tr?????ng n??y ph???i l?? email'
        }
    }
}
Validator.isPassword = function(selector, minLength){
    // console.log(minLength) 
    return {
        selector,
        test(value){
            return value.length >= minLength ? undefined : 'Vui l??ng nh???p password ( T???i thi???u 6 k?? t??? ) '
        }
    }
}
Validator.isConfirm = function(selector, confirm){
    return {
        selector,
        test(value){
            return value ===  confirm() && value !== '' ? undefined : 'D??? li???u nh???p v??o kh??ng ch??nh x??c'
        }
    }
}