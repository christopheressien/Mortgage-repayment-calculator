document.addEventListener("DOMContentLoaded", () => {
  const cardTwoEmptyContent = document.querySelector(".card2_empty_content");
  const cardTwoCompletedContent = document.querySelector(
    ".card2_completed_content"
  );
  const calculateBtn = document.querySelector(".calculateBtn");

  const mortgageAmountInput = document.querySelector(".mortgage_Amount");
  const mortgageTermInput = document.querySelector(".mortgage_Term");
  const interestRateInput = document.querySelector(".interest_rate");

  const monthlyRepay = document.querySelector(".monthly_repay");
  const totalPayment = document.querySelector(".total_payment");

  const repaymentRadio = document.getElementById("repaymentRadio");
  const interestRadio = document.getElementById("interestRadio");

  const amountError = document.querySelector(".mortgage_amount_error");
  const termError = document.querySelector(".mortgage_term_error");
  const rateError = document.querySelector(".interest_rate_error");
  const typeError = document.querySelector(".mortgage_type_error");

  const wrapper = (el) => el.closest(".input-feilds");
  const signEl = (el) => wrapper(el)?.querySelector(".signs");

  // -------- RESET STATE ON LOAD --------
  // Hide all error messages
  [amountError, termError, rateError, typeError].forEach(
    (err) => (err.style.display = "none")
  );
  // Remove error highlight classes
  document
    .querySelectorAll(".input-feilds")
    .forEach((div) => div.classList.remove("inputerror"));
  document
    .querySelectorAll(".signs")
    .forEach((sign) => sign.classList.remove("signserror"));
  // Always show empty state first
  cardTwoEmptyContent.style.display = "flex";
  cardTwoCompletedContent.style.display = "none";

  // -------- LIVE INPUT: REMOVE ERRORS --------
  [mortgageAmountInput, mortgageTermInput, interestRateInput].forEach(
    (input, i) => {
      const spans = [amountError, termError, rateError];
      input.addEventListener("input", () => {
        spans[i].style.display = "none";
        wrapper(input)?.classList.remove("inputerror");
        signEl(input)?.classList.remove("signserror");
      });
    }
  );

  [repaymentRadio, interestRadio].forEach((radio) => {
    radio.addEventListener("change", () => {
      typeError.style.display = "none";
    });
  });

  // -------- CALCULATION FUNCTION --------
  function calculate() {
    let valid = true;

    // Mortgage amount validation
    if (mortgageAmountInput.value.trim() === "") {
      amountError.textContent = "This field is required";
      amountError.style.display = "block";
      wrapper(mortgageAmountInput)?.classList.add("inputerror");
      signEl(mortgageAmountInput)?.classList.add("signserror");
      valid = false;
    } else {
      const amount = parseFloat(mortgageAmountInput.value);
      if (isNaN(amount)) {
        amountError.textContent = "Please enter a valid number";
        amountError.style.display = "block";
        wrapper(mortgageAmountInput)?.classList.add("inputerror");
        signEl(mortgageAmountInput)?.classList.add("signserror");
        valid = false;
      } else if (amount < 1000) {
        amountError.textContent = "Enter amount from £1000";
        amountError.style.display = "block";
        wrapper(mortgageAmountInput)?.classList.add("inputerror");
        signEl(mortgageAmountInput)?.classList.add("signserror");
        valid = false;
      }
    }

    // Term validation
    if (mortgageTermInput.value.trim() === "") {
      termError.style.display = "block";
      wrapper(mortgageTermInput)?.classList.add("inputerror");
      signEl(mortgageTermInput)?.classList.add("signserror");
      valid = false;
    }

    // Rate validation
    if (interestRateInput.value.trim() === "") {
      rateError.style.display = "block";
      wrapper(interestRateInput)?.classList.add("inputerror");
      signEl(interestRateInput)?.classList.add("signserror");
      valid = false;
    }

    // Type validation
    if (!repaymentRadio.checked && !interestRadio.checked) {
      typeError.style.display = "block";
      valid = false;
    }

    // Stop if invalid
    if (!valid) {
      cardTwoCompletedContent.style.display = "none";
      cardTwoEmptyContent.style.display = "flex";
      return;
    }

    // Calculation
    const principal = parseFloat(mortgageAmountInput.value);
    const years = parseFloat(mortgageTermInput.value);
    const rate = parseFloat(interestRateInput.value);

    if (interestRadio.checked) {
      const annualInterest = principal * (rate / 100);
      const monthlyPayment = annualInterest / 12;
      const totalPay = annualInterest * years;

      monthlyRepay.textContent = `£${monthlyPayment.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      totalPayment.textContent = `£${totalPay.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      const totalInterest = principal * (rate / 100) * years;
      const repaymentTotal = principal + totalInterest;
      const monthlyPayment = repaymentTotal / (years * 12);

      monthlyRepay.textContent = `£${monthlyPayment.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      totalPayment.textContent = `£${repaymentTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // Show results
    cardTwoEmptyContent.style.display = "none";
    cardTwoCompletedContent.style.display = "block";
  }

  calculateBtn.addEventListener("click", calculate);
});
