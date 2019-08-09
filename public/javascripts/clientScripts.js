// use jquery for delete confirmation box

$('.confirmation').on('click', function() {
    return confirm('Are you sure you want to delete this?');
});



function addNewService(rowNumber){
  console.log("in clientscript function" + rowNumber);
var label = document.getElementById("label"+rowNumber);
var input = document.getElementById("services"+rowNumber);
var button = document.getElementById(rowNumber);
var rowPlusOne = parseInt(rowNumber) + 1;
let inputText = input.value;
input.value="";
label.innerHTML="service #" + rowPlusOne;

let newlabel = document.createElement("label");
let newLabelText =  document.createTextNode("service #" + rowNumber);
newlabel.appendChild(newLabelText);
let newinput = document.createElement("input");
newinput.name ="services";
newinput.id ="services";
newinput.value = inputText;
newlabel.htmlFor = "services";
newlabel.addClass = "control-label";


let br = document.createElement("br");
let insertBeforeVar = document.getElementById("label" + rowNumber);

servicesDiv.insertBefore(newlabel, insertBeforeVar);
servicesDiv.insertBefore(newinput, insertBeforeVar);
servicesDiv.insertBefore(br, insertBeforeVar);

label.id="label"+rowPlusOne;
button.id=rowPlusOne;
input.id="services"+rowPlusOne;;
}





function clickTable(clickedRow) {
window.location.href="viewEmployeeCertifications/" + clickedRow.id;
}

function OnSelectedIndexChanged(filterBY)
{
let text = filterBY.options[filterBY.selectedIndex].value
   console.log(text);

let searchByTxtBox = document.getElementById("filterText");
searchByTxtBox.placeholder="Search Employee By " + text;
filterTable();
}

function toggleCategorySearch(checkboxObj)
{
  console.log("yes im working " +  checkboxObj.checked);


  if(checkboxObj.checked == true)
  {
    console.log("in if");
filterWithCategory();

  }
else{
      console.log("in else");
   filterTable();

}

}


function expires()
{
  console.log("in expires");

  let chkBox = document.getElementById("expiresCheckBox");
  let expiresDiv = document.getElementById("expiresDiv");
    let expiry = document.getElementById("expiry");
if(chkBox.checked == true)
{
    console.log("in if");
expiresDiv.style.display = "block";
expiry.required = true;
}
else if(chkBox.checked == false)
{
    console.log("in else");
  expiresDiv.style.display = "none";
  expiry.required = false;
}
}





function ddl()
{
  console.log("in filterDDL");

  let input = document.getElementById("filterddl");
  let filter = input.value.toUpperCase();
  let ddl = document.getElementById("coursename");
  console.log(filter);
if(filter == "")
{
  console.log("filter is blank, displaying all")
    for (let i = 0; i < ddl.options.length; i++) {
      var ifCount = 1;
    ddl.options[i].style.display = "";
    if(ifCount == 1)
    {
      console.log("setting selected index");
          ddl.options[i].selected = true;
    }
    ifCount++;
  }
}
else{


   for (let i = 0; i < ddl.options.length; i++) {
     var ifCount = 0;
  // let option = ddl.options[i].getElementsByTagName("option");
      if (ddl.options[i].value.toUpperCase().indexOf(filter) > -1) {
        console.log(ddl.options[i].value + "--- i contain " + filter+ " so im being displayed from the if");
        ifCount++;
        if(ifCount == 1)
        {
          console.log("setting selected index");
          ddl.options[i].selected = true;
        }
     ddl.options[i].style.display = "";
      } else {
        console.log (ddl.options[i].value +"--- i dont.. hiding");
        ddl.options[i].style.display = "none";
      }
    }
}
}

function filterWithCategory()
{
  let input = document.getElementById("filterText");
  let filter = input.value.toUpperCase();
  let table = document.getElementById("filterTable");
  let tr = table.getElementsByTagName("tr");
  let filterBY = document.getElementById("sortBy");
  let categorySearchText = document.getElementById("filterCategory");
  let chk = document.getElementById("enableCertificateSearch");
  let filterCategory = categorySearchText.value.toUpperCase();
  var filterByValue = filterBY.options[filterBY.selectedIndex].value;

  if(filterCategory != "" && chk.checked != false)
  {
    for (let i = 0; i < tr.length; i++)
    {
      let td = tr[i].getElementsByTagName("td")[3];
      if (td)
      {
        let imgs = td.getElementsByTagName('img');
        if (imgs.length > 0)
        {
            for (let x=0; x < imgs.length; x++)
            {
              currentImgTitle = (imgs[x].title).toUpperCase();
                console.log(imgs[x].title);
                if(currentImgTitle.indexOf(filterCategory) > -1)
                {


                 //   tr[i].style.display = "";

                      if(filterByValue == "First Names")
                      {
                            let td1 = tr[i].getElementsByTagName("td")[0];
                            if (td1)
                            {
                                if (td1.innerHTML.toUpperCase().indexOf(filter) > -1)
                                {
                                  console.log(tr[i].id + "  -   i have a cartificate with " + filterCategory + " in it");
                                    tr[i].style.display = "";
                                }
                                else
                                {
                                    tr[i].style.display = "none";
                                }
                            }
                      }
                      if(filterByValue == "Last Names")
                      {
                            let td1 = tr[i].getElementsByTagName("td")[1];
                            if (td1)
                            {
                                if (td1.innerHTML.toUpperCase().indexOf(filter) > -1)
                                {
                                  console.log(tr[i].id + "  -   i have a cartificate with " + filterCategory + " in it");
                                   tr[i].style.display = "";
                                }
                                else
                                {
                                   tr[i].style.display = "none";
                                }
                            }
                      }
                      if(filterByValue == "Departments")
                      {
                            let td1 = tr[i].getElementsByTagName("td")[2];
                            if (td1)
                            {
                                if (td1.innerHTML.toUpperCase().indexOf(filter) > -1)
                                {
                                  console.log(tr[i].id + "  -   i have a cartificate with " + filterCategory + " in it");
                                    tr[i].style.display = "";
                                }
                                else
                                {
                                   tr[i].style.display = "none";
                                }
                            }
                      }
                    break;
                }
                else
                {
                   console.log(tr[i].id + "  -   i dont have a cartificate with " + filterCategory + " in it")
                   tr[i].style.display = "none";
                }
            }

        }
        else
        {
          console.log(tr[i].id + "  -   i dont have a cartificate with " + filterCategory + " in it")
          tr[i].style.display = "none";
        }
      }
    } // loop for each table row
  }
  else
  {
    console.log("  no text in categories! running filterTable scripts")
    if(filterByValue == "First Names")
{
for (let i = 0; i < tr.length; i++) {
   let td3 = tr[i].getElementsByTagName("td")[0];
    if (td3) {
      if (td3.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

else if(filterByValue == "Last Names")
{
    for (let i = 0; i < tr.length; i++) {
   let td3 = tr[i].getElementsByTagName("td")[1];
    if (td3) {
      if (td3.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

else if(filterByValue == "Departments")
{
    for (let i = 0; i < tr.length; i++) {
   let td3 = tr[i].getElementsByTagName("td")[2];
    if (td3) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

}
  }
}

function filterTable() {
  // Declare variables
 let input = document.getElementById("filterText");
  let filter = input.value.toUpperCase();
 let table = document.getElementById("filterTable");
  let tr = table.getElementsByTagName("tr");
  let filterBY = document.getElementById("sortBy");
var filterByValue = filterBY.options[filterBY.selectedIndex].value;

if(enableCertificateSearch.checked != true)
{
  console.log("filterTable() if checked != true");
if(filterByValue == "First Names")
{
for (let i = 0; i < tr.length; i++) {
   let td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

else if(filterByValue == "Last Names")
{
    for (let i = 0; i < tr.length; i++) {
   let td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

else if(filterByValue == "Departments")
{
    for (let i = 0; i < tr.length; i++) {
   let td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

}

else
{
    console.log("Something went wrong")
}

  // Loop through all table rows, and hide those who don't match the search query


}
else{
   console.log("Checkbox is checked, using filter with category");
  filterWithCategory();
}

}
