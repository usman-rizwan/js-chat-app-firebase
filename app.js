
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
  query,
  where,
  getDocs,
  serverTimestamp,
  onSnapshot,
  orderBy
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
let msgUserName = document.getElementById("message-user-name");
let msgUserImage = document.getElementById("message-user-image");
let allUsers = document.getElementById("all-users");
let selectedUserName = document.getElementById("selected-user-name");
let selectedUserEmail = document.getElementById("selected-user-email");
let selectedUserImage = document.getElementById("selected-user-image");
let userChatBox = document.getElementById("user-chat-box");

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

const uploadImage = async () => {
  const fileInput = document.getElementById("file_input");
  const url = await uploadFile(fileInput.files[0]);
  console.log("url -->", url);
  return url;
};

let dataToFirestore = async (user) => {
  const imageUrl = await uploadImage(); // Get the image URL
  let userData = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
    image: imageUrl,
  };
  try {
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      id: user.uid,
    });
    console.log(
      `Document written with ID: ${user.uid} user name -- > ${userData.name}`
    );
    window.location = "/profile.html";
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
    // window.location = "./profile.html";
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
    getUser(uid);
    getAllUsers(user.email);
    console.log(docSnap);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      if (
        location.pathname !== "/profile.html" &&
        location.pathname !== "/index.html"
      ) {
        window.location = "/profile.html";
      }
      if (userEmail || userProfileEmail || userProfileId || userProfileImage) {
        userProfileName.innerHTML = docSnap.data().name;
        userProfileEmail.innerHTML = docSnap.data().email;
        userProfileId.innerHTML = `User Id: ${docSnap.data().id} `;
        userProfileImage.src = docSnap.data().image;
      }
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

const getUser = async (id) => {
  // let id = auth.currentUser.uid;
  // console.log("0",id);
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("User Data --->:", docSnap.data());
    if (msgUserImage || msgUserName) {
      msgUserName.innerHTML = `${docSnap.data().name} (You)`;
      msgUserImage.src = docSnap.data().image;
    }
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

const getAllUsers = async (email) => {
  console.log("email", email);
  const q = query(collection(db, "users"), where("email", "!=", email));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    let { name, email, image } = doc.data();
    if (allUsers) {
      allUsers.innerHTML += ` <div onclick="selectedUserChat('${name}','${email}','${image}','${doc.id}')"
    class="block max-w-sm p-2 m-2  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize" >${name} </h5>
    <p class="font-normal text-gray-700 dark:text-gray-400" >${email}</p>
  </div>`;
    }
  });
};

let selectedUserId;
const selectedUserChat = (name, email, image, uid) => {
  selectedUserId = uid;
  let currentUserUid = auth.currentUser.uid;
  let chatId;
  if (selectedUserName || selectedUserEmail || selectedUserImage) {
    selectedUserName.innerHTML = name;
    selectedUserEmail.innerHTML = email;
    selectedUserImage.src = image;
  }
  if (currentUserUid < selectedUserId) {
    chatId = currentUserUid + selectedUserId;
  } else {
    chatId = selectedUserId + currentUserUid;
  }
  // console.log(chatId);
  getAllChats(chatId);
};

window.selectedUserChat = selectedUserChat;

const messageInput = document.getElementById("message-input");
messageInput &&
  messageInput.addEventListener("keydown", async () => {
    let currentUserUid = auth.currentUser.uid;
    let chatId;
    if (event.keyCode == "13") {
      // console.log(selectedUserId, currentUserUid);

      if (currentUserUid < selectedUserId) {
        chatId = currentUserUid + selectedUserId;
      } else {
        chatId = selectedUserId + currentUserUid;
      }
      console.log(chatId);
      try {
        const docRef = await addDoc(collection(db, "messages"), {
          message: messageInput.value,
          chatId: chatId,
          timestamp: serverTimestamp(),
          senderId: currentUserUid,
          receiverId: selectedUserId,
        });
        console.log("Document written with ID: ", docRef.id);
        console.log("Message sent ");
        messageInput.value = "";
      } catch (error) {
        console.log(error);
      }
    }
  });

const getAllChats = (chatId) => {
  let currentUser = auth.currentUser.uid;
  // console.log("currentUser", currentUser);
  const q = query(collection(db, "messages"), orderBy("timestamp"), where("chatId", "==", chatId));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    userChatBox.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
      if (currentUser == messages[i].senderId) {
        userChatBox.innerHTML += ` <div class="flex justify-end mb-4">
        <div class="bg-green-400 text-white p-4 rounded-tr-lg rounded-tl-lg rounded-bl-lg">
           ${messages[i].message}
        </div>
    </div>
    
    `;
      } else {
        userChatBox.innerHTML += ` <div class="flex mb-4">
        <div class="bg-gray-200 p-4 rounded-tr-lg rounded-tl-lg rounded-br-lg">
        ${messages[i].message}
        </div>
    </div>`;
      }
    }
    // console.log("messages", messages);
  });
};

// let userChatId = "";
// let senderID = "";
// let showMessage = document.getElementById("message-show");
// XdpInLoTEgXXavjPu3EqHxKY0kG3wGc7rWu27XNEi5Az8ZGnjG1dnXI2
