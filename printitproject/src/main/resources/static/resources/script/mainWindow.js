
window.onload = function () {
    valid = "2px solid #28a745";
    invalid = "2px solid #dc3545";
    initial = "1px solid #6c757d";

    // console.log(session.getObject("loginuser"));
	if(session.getObject("loginuser") != null){
        loggedUserName = session.getObject("loginuser").loginusername;
        loggedUser = httpRequest("/user/getuser/"+loggedUserName , "GET" );
        console.log(loggedUser)
        session.setObject('activeuser', loggedUser);

        console.log(loggedUser);
        if(loggedUser.employeeId != undefined){
            if(loggedUser.employeeId.photo != null) {
                profileImage.src = atob(loggedUser.employeeId.photo);
            }
            else{
                profileImage.src = 'resources/image/nouser.jpg';
            }
            lblLogUser.innerHTML = loggedUser.userName;
            loadchangepassword();
            //spnDesignation.innerHTML = loggedUser.employeeId.designationId.name;
        }else {
            window.location.href = "http://localhost:8080/login";
        }
    }else
		 window.location.href = "http://localhost:8080/login";



    // Module desabled
    if(session.getObject("activeuser").employeeId.id !=1) {
        usermodulelist = httpRequest("../module/listbyuser?userid=" + session.getObject("activeuser").id, "GET");

        console.log(usermodulelist)
        allmodule = httpRequest("../module/list", "GET");


// Module desabled
        //get from the session, not the admin
if(session.getObject("activeuser").employeeId.id !=1) {
    //get all permission modules list for that particular user from the session
    usermodulelist = httpRequest("../module/listbyuser?userid=" + session.getObject("activeuser").id, "GET");

    //get all modules
    allmodule = httpRequest("../module/list", "GET");


    //list deka coparir karanwa
/*    dislist = listCompera(allmodule,usermodulelist,"id","name");

    for (x in dislist) {
        mname = dislist[x].name;
        //ek ek module name eke dala thiyena class names, id allgnna thiyenne
       var lielement =  document.getElementById(mname);
       if(lielement != null)
           //id ekak thiyenwa nm ema elment eka remove karana
        document.getElementById(mname).remove();


        var divelement =  document.getElementById(mname);
        //class thiyena elemenents remove karnwa meken---> godak than walin meka remove wenwa class hinda
        if(divelement.length != 0)
            divelement[0].style.display = "none";

    }
}*/

        dislist = listCompera(allmodule,usermodulelist,"id","name");
        // console.log(dislist);
        for (var x in dislist) {
            mname = dislist[x].name;
           var lielement =  document.getElementById(mname);
           if(lielement != null)
            document.getElementById(mname).remove();

            var divelement =  document.getElementsByClassName(mname);
            if(divelement.length != 0)
            for(var i=0; i<divelement.length; i++){
            divelement[i].style.display = "none";
            }


        }
    }
    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

}

function btnSignoutMC() {
    swal({
        title: "Do you want to sign out?",
        text: " ",
        icon: "warning",
        buttons: true,
        closeOnClickOutside: false
    }).then((willDelete) => {
        if (willDelete) {
            swal({
                title: "Sign Out Successful",
                text: " ",
                icon: "success",
                timer: 1500,
                buttons: false,
                closeOnClickOutside: false
            }).then(() => {
                window.location.assign('/logout');
            });

        }
    });
}

function loadchangepassword() {
    changePassword = new Object();
    oldChangePassword = null;

    changePassword.username = session.getObject('activeuser').userName;

    txtUsernameView.innerHTML = changePassword.username;
    txtCurrentPassword.value = "";
    txtNewPassword.value = "";
    txtConfirmPassword.value = "";
}

function getErrors() {
    var errors = "";

    if (txtCurrentPassword.value == "") {
        errors = errors + "\n" + "Current password is not entered";
        txtCurrentPassword.style.border = invalid;
    }

    if (txtNewPassword.value == "") {
        errors = errors + "\n" + "New password is not entered";
        txtNewPassword.style.border = invalid;
    }

    if (txtConfirmPassword.value == 0) {
        errors = errors + "\n" + "Confirm password is not entered";
        txtConfirmPassword.style.border = invalid;
    }

    return errors;
}

function btnSaveChangePasswordMC() {
    var errors = getErrors();
    if (errors == "") {
        swal({
            title: "Are you sure to change password of following user?",
            text: "Username : " + changePassword.username,
            icon: "warning",
            buttons: true,
            closeOnClickOutside: false
        }).then((willDelete) => {
            if (willDelete) {
                // var response = httpRequest("/changepassword", "POST", changePassword);
                var response = "0";
                if (response == "0") {
                    swal({
                        title: "Saved Successfully",
                        text: " System Going to Logout",
                        icon: "success",
                        timer: 1500,
                        buttons: false,
                        closeOnClickOutside: false
                    }).then(() => {

                        window.location.assign('/logout');
                    });
                } else {
                    swal({
                        title: "Failed to change password",
                        text: "Response - " + response,
                        icon: "error",
                        closeOnClickOutside: false
                    });
                }
            }
        });
    } else {
        // Error Message - Invalid Data or Empty Fields
        swal({
            title: "Failed to add",
            text: "Please fill in all required fields with valid data",
            icon: "error",
            closeOnClickOutside: false
        });
    }
}}

function btnSignoutMC() {
    swal({
        title: "Do you want to sign out?",
        text: " ",
        icon: "warning",
        buttons: true,
        closeOnClickOutside: false
    }).then((willDelete) => {
        if (willDelete) {
            swal({
                title: "Sign Out Successful",
                text: " ",
                icon: "success",
                timer: 1500,
                buttons: false,
                closeOnClickOutside: false
            }).then(() => {
                window.location.assign('/logout');
            });

        }
    });
}