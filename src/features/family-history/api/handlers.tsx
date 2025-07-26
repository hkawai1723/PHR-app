import {
  FamilyHistoryRequestType,
  FamilyHistoryResponseType,
  FamilyHistoryServerType,
} from "@/features/family-history/family-history-types-and-schema";
import { adminDB } from "@/lib/firebase/firebase-admin";
import { APIAuthError, checkUserOnAPI } from "@/lib/utils";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function createFamilyHistory(request: Request) {
  try {
    const user = await checkUserOnAPI();
    const body: FamilyHistoryRequestType = await request.json();
    const { userId, ...formData } = body;
    const docRef = adminDB.collection("familyHistory").doc();
    const FamilyHistoryData = {
      ...formData,
      userId,
      writtenBy: user.uid,
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
  /* "familyHistory"から、ログイン中のuser.uidと一致するデータを取得する。 */
  try {
    const user = await checkUserOnAPI();
    const snapshot = await adminDB
      .collection("familyHistory")
      .where("userId", "==", user.uid)
      .orderBy("relationship", "desc")
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
    await checkUserOnAPI();

    const { id } = params;

    const docRef = adminDB.collection("familyHistory").doc(id);
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

async function updateFamilyHistory(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await checkUserOnAPI();
    const { id } = params;
    const body = await request.json();

    const docRef = adminDB.collection("familyHistory").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Family history not found" },
        { status: 404 }
      );
    }

    const data = {
      ...body,
      writtenBy: user.uid,
      updatedAt: Timestamp.now(),
    };

    await docRef.update(data);

    const updatedData = (await docRef.get()).data();
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...updatedData },
    });
  } catch (error) {
    if (error instanceof APIAuthError) {
      return error.response;
    }

    console.error("Error on updating PMH:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export const handlers = {
  POST: createFamilyHistory,
  GET: getFamilyHistoryList,
  DELETE: deleteFamilyHistory,
  PATCH: updateFamilyHistory,
};
