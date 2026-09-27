import "server-only";

import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getFirestore,
} from "firebase-admin/firestore";


const options = {
  credential:
    applicationDefault(),
};


if (
  process.env.FIREBASE_PROJECT_ID
) {
  options.projectId =
    process.env.FIREBASE_PROJECT_ID;
}


const adminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(
        options
      );


export const adminDb =
  getFirestore(
    adminApp
  );


export const adminAuth =
  getAuth(
    adminApp
  );