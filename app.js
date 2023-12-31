

import {
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  db,
  setDoc,
  doc,
  storage,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "./firebase.js";

let userName = document.getElementById("signup-user-name");
let userEmail = document.getElementById("signup-email");
let userPassword = document.getElementById("signup-password");
let userImage = document.getElementById("file_input");
let loader = document.getElementById("loader");
let signupBtn = document.getElementById("signup-btn");
let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passFormat = /^[A-Za-z]\w{7,14}$/;

console.log(userEmail.value, userName.value, userPassword.value);

// Register User
const signUp = () => {
  if (!userName.value.trim()) { 
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Enter Valid Name",
    });
  } else if (!userEmail.value.match(mailFormat)) {
    // console.log("Incorrect Email");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Enter correct Email Address",
    });
  } else if (!userPassword.value.match(passFormat)) {
    // console.log("Pass Format Not Correct");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title:
        "Password must be greater than 6 charachters and must contains alphabets and number",
    });
  } else {
    loader.classList.toggle("hidden");
    signupBtn.disabled = true;

    createUserWithEmailAndPassword(auth, userEmail.value, userPassword.value)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        dataToFirestore(user);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        loader.classList.toggle("hidden");
        signupBtn.disabled = false;
        // ..
      });
  }
};

signupBtn && signupBtn.addEventListener("click", signUp);

let uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${userName.value.split(" ").join("-")}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};
// uploadFile()

let dataToFirestore = async (user) => {
  let userData = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
    iamge : await uploadFile()
  };
  try {
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      id: user.uid,
    });
    console.log(
      `Document written with ID: ${user.uid} user name -- > ${userData.name}`
    );
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Signed up successfully",
    });
    loader.classList.toggle("hidden");
    signupBtn.disabled = false;
  } catch (e) {
    console.error("Error adding document: ", e);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "An unknown error occurred",
    });
  }
};
