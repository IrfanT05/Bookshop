window.onload=()=>{
    document.querySelector('.card-number-input').addEventListener('input', function (e) {
        const input = e.target;
        let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = value.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            input.value = parts.join(' ');
        } else {
            input.value = value;
        }
    });

    function validateCreditCard(cardNumber) {
        const cardStartNumbers = /^5[1-5][0-9]{14}$/;
        return cardStartNumbers.test(cardNumber);
    }

    function validateExpirationDate(expirationMM, expirationYY) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        expirationMM = parseInt(expirationMM);
        expirationYY = parseInt(expirationYY);

        if (expirationYY < currentYear) {
            return false;
        }

        if (expirationYY === currentYear && expirationMM < currentMonth) {
            return false;
        }

        return true;
    }

    function validateSecurityCode(cvv) {
        return cvv.length === 3 || cvv.length === 4;
    }

    document.getElementById('payment-form').addEventListener('submit', function (e) {
        e.preventDefault(); 

        const cardNumber = document.getElementById('card-number-input').value.replace(/\s+/g, '');
        const expirationMM = document.getElementById('month-input').value;
        const expirationYY = document.getElementById('year-input').value;
        const cvv = document.getElementById('cvv-input').value;

        if (!validateCreditCard(cardNumber)) {
            alert('Invalid card number, Please check the card number begins with 51-55 and is a 16 digit number');
            return;
        }

        if (!validateExpirationDate(expirationMM, expirationYY)) {
            alert('Invalid Expiry date, Please check the expiry date again');
            return;
        }

        if (!validateSecurityCode(cvv)) {
            alert('Invalid CVV number, Please check that its either 3-4 numbers');
            return;
        }

        const paymentData = {
            master_card: cardNumber,
            exp_year: expirationYY,
            exp_month: expirationMM,
            cvv_code: cvv,
        };


        fetch('http://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })
            .then(async response => {
                if (response.ok) {
                    const cardNumber4digits = cardNumber.slice(-4);
                    window.location.href = `success.html?cardNumber4digits=${cardNumber4digits}`;
                    return response.json();
                    
                } 
                else 
                {
                    const error = await response.json();
                    throw (error.message || 'Something went wrong');
                }
            })
            .catch(error => {
                alert(error.message);
            });
    });
    

   
}

function pay() {
    window.location.href = "pay.html";
}
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    
    document.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        const body = document.body;

        if (window.scrollY > 25) {
            header.classList.add('scrolling');
            body.classList.add('scrolled');
        } else {
            header.classList.remove('scrolling');
            body.classList.remove('scrolled');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
          
    const urlParams = new URLSearchParams(window.location.search);
    const cardNumber4digits = urlParams.get('cardNumber4digits');

    
    document.getElementById('cardNumber4digits').innerText = cardNumber4digits;
});

function redirectToPayment() {
    window.location.href = 'pay.html';
}

