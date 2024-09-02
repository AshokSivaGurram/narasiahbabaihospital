import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://hospitalmanagement-801c7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const patientsListInDB = ref(database, "patientsList")

var addNewMedicine = document.getElementById("add-new-medicine")
var newMedicineForm = document.getElementById("new-medicine-form")
var newMedicinesAdder = document.getElementById("new-medicines-adder")
var addNewMedicineButton = document.getElementById("add-new-medicine-button")
var calculateTotal = document.getElementById("calculate-total")
var submitButton = document.getElementById("submit")
var previousPatientsList = document.getElementById("previous-patients-list")
var searchpatientdata = document.getElementById("searchpatientdata")
var todayTotal =  document.getElementById("today-total-amount")
var gotodatesubmit = document.getElementById("gotodatesubmit")
var searchpatientsubmit = document.getElementById("searchpatientsubmit")

searchpatientsubmit.addEventListener('click',function(){
    let patient_name = document.getElementById("searchpatient").value.replace(/\s{2,}/g, ' ').trim()
    var itemsArray = 0
    var patient_data = 0
    onValue(patientsListInDB, function(snapshot) {
        if (snapshot.exists()) {
            itemsArray = Object.entries(snapshot.val())      
        } 
        for (let i = (itemsArray.length-1); i >=0 ; i--) {
            let currentPatient = itemsArray[i]
            console.log(currentPatient[1]["name"])
            console.log(patient_name)
            if (currentPatient[1]["name"]===patient_name){
                patient_data = currentPatient
        }
        }
    })
    if (patient_data != 0){
        let currentPatientName = patient_data[1]["name"]
    let medicinesbydate = patient_data[1]["medicinesbydate"]
    
    let j=0
    let medlis = ""
    let currentPatientTotalPrice = patient_data[1]["totalPrice"]
    while (j<medicinesbydate.length) {
        let i=2
        let value = medicinesbydate[j]
        j+=1
        let date = value["date"]
        let currentPatientMedicineNames = value["medicineNames"]
        let currentPatientMedicinePrices = value["medicinePrices"]
        medlis += `<div class="dateofmedicine">`+date+`</div>`
        
        medlis+=`
        <div class="medicine-item1"> <b>`+currentPatientMedicineNames[0]+`</b> - `+currentPatientMedicinePrices[0]+`</div> <p></p>`
        medlis+=`
        <div class="medicine-item1"> <b>`+currentPatientMedicineNames[1]+`</b> - ₹`+currentPatientMedicinePrices[1]+`</div>`
        medlis += `<div class="section-title1">Medicine</div>`
        while (i<currentPatientMedicineNames.length){
            medlis+=`
            <div class="medicine-item1">`+currentPatientMedicineNames[i]+` - ₹`+currentPatientMedicinePrices[i]+`</div>`
            i+=1
        }
        medlis+=`<div class="submedprice"> Sub Total : ₹`+value["price"]+`</div>`
      }
    searchpatientdata.innerHTML= `
    <div class="card2">
    <div class="patient-name1">`+currentPatientName+`</div>

    
    <div class="medicine-list1">`+medlis+`
    </div>
    <br>
    <div class="total-price1">Total: ₹`+currentPatientTotalPrice+`</div>
    <button type="submit" id="updatepatientbutton"> Update </button>
</div>
    `
    var updatebutton = document.getElementById("updatepatientbutton")
    updatebutton.addEventListener('click', function(){
        searchpatientdata.innerHTML+=`
        <div id="updatepatientform">
            <h2>Update Patient</h2>
            <div class="form-contents">
                <h3>Consultation Fee</h3> &emsp;
                <input type="number" id="updateconsultation-fee">
            </div>
            <div class="form-contents">
                <h3>Description</h3> &emsp;
            </div>
            <textarea id="updatedescription" rows="4" cols="50"></textarea>
            <div class="form-contents" id="adding-medicines-form">
                <h3 id="update-patient-add-medicine">Medicines</h3>
                <div class="form-contents" id="update-medicines-adder">  
                    No Medicines Added.
                </div>
                <div id="update-medicine-form"></div>
                <button id="update-new-medicine">Add Medicine</button>
            </div>
            <div class="form-contents">
                <h2>Total Price</h2>
                <input type="number" id="updatedtotal-price"> &emsp;
                <button id="updatecalculate-total">Calculate Total</button>
            </div>
            <button id="updatesubmit">Update</button>
        </div>
        `
        document.getElementById("updatesubmit").addEventListener('click', function(){
            var updatedconsultationFee = Number(document.getElementById("updateconsultation-fee").value)
            var updateddescription = document.getElementById("updatedescription").value
            var updatedtotal = document.getElementById("updatedtotal-price").value
            var medicineNames = document.querySelectorAll(".medicine-names")
            var medicinePrices = document.querySelectorAll(".medicine-prices")
            var patient_data2 = patient_data
            var medicineNames1=["sample"]
            var medicinePrices1=["sample"]
            medicineNames1[0] = "Description"
            medicinePrices1[0] = updateddescription
            medicineNames1[1] = "Consultation Fee"
            medicinePrices1[1] = updatedconsultationFee
            for(let i=0;i<medicineNames.length;i++){
                medicineNames1[i+2] =medicineNames[i].innerText
            }
            for(let i=0; i<medicinePrices.length;i++){
                medicinePrices1[i+2] = medicinePrices[i].textContent
            }
            var todayDate = new Date().toISOString().slice(0, 10);
            var updatedmedicinebydates = {"date":todayDate,"medicineNames":medicineNames1,
                "medicinePrices":medicinePrices1,"price":updatedtotal}
            patient_data[1]["totalPrice"]=Number(patient_data[1]["totalPrice"])+Number(updatedtotal)
            patient_data[1]["medicinesbydate"].push(updatedmedicinebydates)
            remove(patientsListInDB, patient_data2)
            push(patientsListInDB, patient_data[1])
            searchpatientdata.innerHTML=``
            alert("Patient Data Updated!")
        })
        document.getElementById("updatecalculate-total").addEventListener("click", function(){
            let consultationFee = Number(document.getElementById("updateconsultation-fee").value)
            var totalPrice = 0
            var medicines = document.querySelectorAll(".medicine-prices")
            for (let i=0; i<medicines.length;i++){
                totalPrice += Number(medicines[i].innerHTML)
            }
            document.getElementById("updatedtotal-price").value=consultationFee+totalPrice
        })
    var updateNewMedicine = document.getElementById("update-new-medicine")
    var updatemedicinesadder = document.getElementById("update-medicines-adder")
    updateNewMedicine.addEventListener('click', function(){
        document.getElementById("update-medicine-form").innerHTML =
        `<div class="form-contents">
        <h4>Medicine Name</h4>
        <input type="text" id="update-medicine-name">
    </div>
    <div class="form-contents">
        <h4>Price</h4>
        <input type="number" id="update-medicine-price">
        <button id="update-new-medicine-button">Add</button>
    </div>`
    document.getElementById("update-new-medicine-button").addEventListener("click", function(){
        var medicineName = document.getElementById("update-medicine-name").value
        var medicinePrice = document.getElementById("update-medicine-price").value
        console.log(medicineName)
        if((medicineName != "") && (medicinePrice != null)){
            if (updatemedicinesadder.innerText==="No Medicines Added."){
                updatemedicinesadder.innerHTML=`
                <div class="flex">
                    <div id="updatemedicine-name">
                        <h4 class="left">Medicine Name</h4>
                    </div>
                    <div id="updatemedicine-price">
                        <h4 class="left">Price</h4>
                    </div>
                </div>
                `
            }
            document.getElementById("updatemedicine-name").innerHTML+=`<p> <span class="medicine-names">`+medicineName+`</span> </p>`
            document.getElementById("updatemedicine-price").innerHTML+=`<p> <span class="medicine-prices">`+medicinePrice+`</span></p>`
        }
        document.getElementById("update-medicine-form").innerHTML = ``
    })
    })
    })
    
    }
    else{
        searchpatientdata.innerHTML = `<br><div class="searchpatienterror">No patient with this name!</div>`
    }
    

})

addNewMedicine.addEventListener('click',function() {
    console.log("clicked")
    newMedicineForm.innerHTML = `
    <div class="form-contents">
        <h4>Medicine Name</h4>
        <input type="text" id="new-medicine-name">
    </div>
    <div class="form-contents">
        <h4>Price</h4>
        <input type="number" id="new-medicine-price">
        <button id="add-new-medicine-button">Add</button>
    </div>
    `
    document.getElementById("add-new-medicine-button").addEventListener("click", function(){
        var medicineName = document.getElementById("new-medicine-name").value
        var medicinePrice = document.getElementById("new-medicine-price").value
        if((medicineName != "") && (medicinePrice != null)){
            if (newMedicinesAdder.innerText==="No Medicines Added."){
                newMedicinesAdder.innerHTML=`
                <div class="flex">
                    <div id="medicine-name">
                        <h4 class="left">Medicine Name</h4>
                    </div>
                    <div id="medicine-price">
                        <h4 class="left">Price</h4>
                    </div>
                </div>
                `
            }
            document.getElementById("medicine-name").innerHTML+=`<p> <span class="medicine-names">`+medicineName+`</span> </p>`
            document.getElementById("medicine-price").innerHTML+=`<p> <span class="medicine-prices">`+medicinePrice+`</span></p>`
        }
        newMedicineForm.innerHTML = ``
    })
})

calculateTotal.addEventListener("click", function(){
    var consultationFee = Number(document.getElementById("consultation-fee").value)
    var totalPrice = 0
    var medicines = document.querySelectorAll(".medicine-prices")
    for (let i=0; i<medicines.length;i++){
        totalPrice += Number(medicines[i].innerHTML)
    }
    document.getElementById("total-price").value=consultationFee+totalPrice
})

submitButton.addEventListener("click", function(){
    var patientName = document.getElementById("new-patient-name")
    var validated = true
    var itemsArray = 0
    onValue(patientsListInDB, function(snapshot) {
        if (snapshot.exists()) {
            itemsArray = Object.entries(snapshot.val())      
        } 
    })
    var patient=patientName.value.replace(/\s{2,}/g, ' ').trim()
    for (let i = (itemsArray.length-1); i >=0 ; i--) {
        let currentPatient = itemsArray[i]
        
        if (currentPatient[1]["name"]===patient){
            console.log(currentPatient[1]["name"])
            validated=false
            alert("Name of patient already exists!")
            break
    }
    }
    if (validated){
    var consultationFee = document.getElementById("consultation-fee")
    var medicineNames = document.querySelectorAll(".medicine-names")
    var medicinePrices = document.querySelectorAll(".medicine-prices")
    var totalPrice = document.getElementById("total-price")
    var description = document.getElementById("description")
    var medicineNames1=["sample"]
    var medicinePrices1=["sample"]
    medicineNames1[0] = "Description"
    medicinePrices1[0] = description.value
    medicineNames1[1] = "Consultation Fee"
    medicinePrices1[1] = consultationFee.value
    for(let i=0;i<medicineNames.length;i++){
        medicineNames1[i+2] =medicineNames[i].innerText
    }
    for(let i=0; i<medicinePrices.length;i++){
        medicinePrices1[i+2] = medicinePrices[i].textContent
    }
    var todayDate = new Date().toISOString().slice(0, 10);
    var medicinebydates = [{"date":todayDate,"medicineNames":medicineNames1,
        "medicinePrices":medicinePrices1,"price":totalPrice.value}]
    var dict1={
        "name":patient,
        "medicinesbydate":medicinebydates,
        "totalPrice":totalPrice.value,
        "last_updated":todayDate
    }
 
    push(patientsListInDB, dict1)
    patientName.value=""
    consultationFee.value=""
    description.value=""
    newMedicinesAdder.innerHTML="No Medicines Added."
    totalPrice.value=""
}
})
function clearPatientListEl(){
    previousPatientsList.innerHTML = ""
}
function appendItemTopreviousPatientsList(currentPatient, price){
    console.log(currentPatient)
    let currentPatientName = currentPatient[1]["name"]
    let medicinesbydate = currentPatient[1]["medicinesbydate"]
    let currentPatientTotalPrice = price
    todayTotal.innerText = Number(todayTotal.innerText)+Number(currentPatientTotalPrice)
    
    let j=0
    let medlis = ""
    while (j<medicinesbydate.length) {
        let i=2
        let value = medicinesbydate[j]
        j+=1
        console.log(value)
        let date = value["date"]
        console.log(date)
        let currentPatientMedicineNames = value["medicineNames"]
        let currentPatientMedicinePrices = value["medicinePrices"]
        medlis += `<div class="dateofmedicine">`+date+`</div>`
        
        medlis+=`
        <div class="medicine-item1"> <b>`+currentPatientMedicineNames[0]+`</b> - `+currentPatientMedicinePrices[0]+`</div> <p></p>`
        medlis+=`
        <div class="medicine-item1"> <b>`+currentPatientMedicineNames[1]+`</b> - ₹`+currentPatientMedicinePrices[1]+`</div>`
        medlis += `<div class="section-title1">Medicine</div>`
        while (i<currentPatientMedicineNames.length){
            medlis+=`
            <div class="medicine-item1">`+currentPatientMedicineNames[i]+` - ₹`+currentPatientMedicinePrices[i]+`</div>`
            i+=1
        }
        medlis+=`<div class="submedprice"> Sub Total : ₹`+value["price"]+`</div>`
      }
      console.log(medlis)
    previousPatientsList.innerHTML+= `
    <div class="card1">
    <div class="patient-name1">`+currentPatientName+`</div>

    
    <div class="medicine-list1">`+medlis+`
    </div>
    <br>
    <div class="total-price1">Total: ₹`+currentPatientTotalPrice+`</div>
</div>
    `
}
onValue(patientsListInDB, function(snapshot) {
    var todayDate = new Date().toISOString().slice(0, 10);
    todayTotal.innerText=0
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearPatientListEl()
        
        for (let i = (itemsArray.length-1); i >=0 ; i--) {
            let currentPatient = itemsArray[i]
            
            if (currentPatient[1]["last_updated"]===todayDate){
            appendItemTopreviousPatientsList(currentPatient,currentPatient[1]["totalPrice"])}
        }    
    } 
    if (previousPatientsList.innerHTML==``) {
        previousPatientsList.innerHTML = `<div class="patient-name1" id="nopatientsyet">No Patients Here Yet</div>`
    }
})

gotodatesubmit.addEventListener("click", function(){
    onValue(patientsListInDB, function(snapshot) {
        var todayDate = document.getElementById("gotodate").value
        var itemsarray = 0
        todayTotal.innerText=0
        if (snapshot.exists()) {
            itemsarray = Object.entries(snapshot.val())  
        } 
        clearPatientListEl()
            
        for (let i = (itemsarray.length-1); i >= 0 ; i--) {
            let currentPatient = itemsarray[i]
            console.log(currentPatient)
            let j=0
            let medicinebydates1=currentPatient[1]["medicinesbydate"]
            console.log(medicinebydates1)
            while (j<medicinebydates1.length){
                if (medicinebydates1[j]["date"]===todayDate){
                    appendItemTopreviousPatientsList(currentPatient,medicinebydates1[j]["price"])
                }
                j+=1
            }
            }  
        if (previousPatientsList.innerHTML==``) {
            previousPatientsList.innerHTML = `<div class="patient-name1" id="nopatientsyet">No Patients Here Yet</div>`
        }
    })

})