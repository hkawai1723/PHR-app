import {
  PMHRequestType,
  PMHResponseType,
  PMHServerType,
} from "@/features/pmh/pmh-types";
import { getUserOnServer } from "@/utils/get-server-user";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase/firebase-admin";

export async function createPMH(request: Request) {
  try {
    const body: PMHRequestType = await request.json();
    const { userId, ...formData } = body;
    const docRef = adminDB.collection("pastMedicalHistory").doc();
    const PMHData = {
      ...formData,
      userId,
      writtenBy: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await docRef.set(PMHData);
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...PMHData },
    });
  } catch (error) {
    console.error("Error creating PMH:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

async function getPMHList() {
  /* "pastMedicalHistory"から、ログイン中のuser.uidと一致するデータを取得する。 */
  try {
    const user = await getUserOnServer();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: User not authenticated",
        },
        { status: 401 }
      );
    }
    const snapshot = await adminDB
      .collection("pastMedicalHistory")
      .where("userId", "==", user.uid)
      .orderBy("diagnosisDate", "desc")
      .get();

    // if (snapshot.empty) {
    //   return NextResponse.json({ success: true, data: [] });
    // }
    const PMHList: PMHResponseType[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as PMHServerType),
      id: doc.id,
    }));
    return NextResponse.json({ success: true, data: PMHList });
  } catch (error) {
    console.error("Error fetching PMH list:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

async function deletePMH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserOnServer();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: User not authenticated",
        },
        { status: 401 }
      );
    }

    const docRef = adminDB.collection("pastMedicalHistory").doc(params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "PMH not found" },
        { status: 404 }
      );
    }
    await docRef.delete();
    return NextResponse.json({
      success: true,
      message: "PMH deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting PMH:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// const async function updateHistory(request: Request, {params}: {params: {id: string}}) {
//   try {
//     const body: PMHRequestType = await request.json();
//     const { userId, ...formData } = body;

//     const docRef = adminDB.collection("pastMedicalHistory").doc(params.id);
//     const doc = await docRef.get();
//     if (!doc.exists) {
//       return NextResponse.json(
//         { success: false, error: "PMH not found" },
//         { status: 404 }
//       );
//     }
//     const PMHData: PMHServerType = {
//       ...formData,
//       userId,
//       writtenBy: userId,
//       updatedAt: Timestamp.now(),
//     };
//     await docRef.update(PMHData);
//     return NextResponse.json({
//       success: true,
//       data: { id: docRef.id, ...PMHData },
//     });
//   } catch (error) {
//     console.error("Error updating PMH:", error);
//     let errorMessage = "An unknown error occurred.";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     return NextResponse.json(
//       { success: false, error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

export const handlers = {
  POST: createPMH,
  GET: getPMHList,
  DELETE: deletePMH,
  // PATCH: updateHistory,
};
