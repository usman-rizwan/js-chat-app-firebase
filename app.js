

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
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getDoc,
  signOut,
} from "./firebase.js";

let userName = document.getElementById("signup-user-name");
let userEmail = document.getElementById("signup-email");
let userPassword = document.getElementById("signup-password");
let userImage = document.getElementById("file_input");
let loader = document.getElementById("loader");
let loginLoader = document.getElementById("login-loader");
let signupBtn = document.getElementById("signup-btn");
let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passFormat = /^[A-Za-z]\w{7,14}$/;
let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");
let loginBtn = document.getElementById("login-btn");
let logoutBtn = document.getElementById("logout-btn");
let userProfileImage = document.getElementById("user-profile-image");
let userProfileName = document.getElementById("user-profile-name");
let userProfileEmail = document.getElementById("user-profile-email");
let userProfileId = document.getElementById("user-profile-id");
// console.log(userEmail.value, userName.value, userPassword.value);

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
    const storageRef = ref(
      storage,
      `images/${userName.value.split(" ").join("-")}`
    );

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

const uploadImage = async () => {
  const file = document.getElementById("file_input");
  const url = await uploadFile(file.files[0]);
  console.log("url -->", url);
  return url;
};

let dataToFirestore = async (user) => {
  uploadImage();
  let userData = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
    image: await uploadFile(),
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
    userName.value = "";
    userEmail.value = "";
    userPassword.value = "";
    userImage.value = "";
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
    loader.classList.toggle("hidden");
    signupBtn.disabled = false;
  }
};

// userImage.addEventListener("change", () => {
//   // files = event.target.files[0]
//   console.log(event.target.files[0]);
//   console.log(URL.createObjectURL(event.target.files[0]));
// });

const login = () => {
  if (!loginEmail.value.match(mailFormat)) {
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
  } else if (!loginPassword.value.match(passFormat)) {
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
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
      .then((userCredential) => {
        loginLoader.classList.toggle("hidden");
        loginBtn.disabled = true;
        // Signed in
        const user = userCredential.user;
        console.log(user);
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
          title: "Logged in successfully",
        });
        loginEmail.value = "";
        loginPassword.value = "";
        loginLoader.classList.toggle("hidden");
        loginBtn.disabled = false;

        // ...
      })
      .catch((error) => {
        loginLoader.classList.toggle("hidden");
        loginBtn.disabled = true;
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
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
          title: "Invalid Email or Password",
        });
        loginLoader.classList.toggle("hidden");
        loginBtn.disabled = false;
      });
  }
};

loginBtn && loginBtn.addEventListener("click", login);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      if (location.pathname !== "/profile.html") {
        window.location = "/profile.html";
      }
      userProfileEmail.innerHTML = docSnap.data().email;
      userProfileName.innerHTML = docSnap.data().name;
      userProfileId.innerHTML = `User Id: ${docSnap.data().id} `;
      userProfileImage.src = docSnap.data().image;
    } else {
      console.log("No such document!");
      if (
        location.pathname !== "/login.html" &&
        location.pathname !== "/signup.html"
      ) {
        window.location = "/signup.html";
      }
      // docSnap.data() will be undefined in this case
    }
    // ...
  } else {
    // User is signed out
    console.log("not logged in");
    if (
      location.pathname !== "/login.html" &&
      location.pathname !== "/signup.html"
    ) {
      window.location = "/signup.html";
    }
  }
});

let logOutUser = () => {
  signOut(auth)
    .then(() => {
     // localStorage.clear();
      console.log("Log out Successfully");
      window.location = "/login.html";
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
};


logoutBtn && logoutBtn.addEventListener("click", logOutUser);
