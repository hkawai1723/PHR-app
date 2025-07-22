import {
  FamilyHistoryRequestType,
  FamilyHistoryResponseType,
  FamilyHistoryServerType,
} from "@/features/family-history/family-history-types-and-schema";
import { getUserOnServer } from "@/utils/get-server-user";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase/firebase-admin";

export async function createFamilyHistory(request: Request) {
  try {
    const body: FamilyHistoryRequestType = await request.json();
    const { userId, ...formData } = body;
    const docRef = adminDB.collection("pastMedicalHistory").doc();
    const FamilyHistoryData = {
      ...formData,
      userId,
      writtenBy: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await docRef.set(FamilyHistoryData);
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...FamilyHistoryData },
    });
  } catch (error) {
    console.error("Error creating FamilyHistory:", error);
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

async function getFamilyHistoryList() {
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
    const FamilyHistoryList: FamilyHistoryResponseType[] = snapshot.docs.map(
      (doc) => ({
        ...(doc.data() as FamilyHistoryServerType),
        id: doc.id,
      })
    );
    return NextResponse.json({ success: true, data: FamilyHistoryList });
  } catch (error) {
    console.error("Error fetching FamilyHistory list:", error);
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

async function deleteFamilyHistory(
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

    const { id } = await params;

    const docRef = adminDB.collection("pastMedicalHistory").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "FamilyHistory not found" },
        { status: 404 }
      );
    }
    await docRef.delete();
    return NextResponse.json({
      success: true,
      message: "FamilyHistory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting FamilyHistory:", error);
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
//     const body: FamilyHistoryRequestType = await request.json();
//     const { userId, ...formData } = body;

//     const docRef = adminDB.collection("pastMedicalHistory").doc(params.id);
//     const doc = await docRef.get();
//     if (!doc.exists) {
//       return NextResponse.json(
//         { success: false, error: "FamilyHistory not found" },
//         { status: 404 }
//       );
//     }
//     const FamilyHistoryData: FamilyHistoryServerType = {
//       ...formData,
//       userId,
//       writtenBy: userId,
//       updatedAt: Timestamp.now(),
//     };
//     await docRef.update(FamilyHistoryData);
//     return NextResponse.json({
//       success: true,
//       data: { id: docRef.id, ...FamilyHistoryData },
//     });
//   } catch (error) {
//     console.error("Error updating FamilyHistory:", error);
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
  POST: createFamilyHistory,
  GET: getFamilyHistoryList,
  DELETE: deleteFamilyHistory,
  // PATCH: updateHistory,
};
