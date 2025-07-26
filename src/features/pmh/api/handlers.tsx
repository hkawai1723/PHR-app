import {
  PMHRequestType,
  PMHResponseType,
  PMHServerType,
} from "@/features/pmh/pmh-types-and-schema";
import { adminDB } from "@/lib/firebase/firebase-admin";
import { APIAuthError, checkUserOnAPI } from "@/lib/utils";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function createPMH(request: Request) {
  try {
    const user = await checkUserOnAPI();
    const body: PMHRequestType = await request.json();
    const { userId, ...formData } = body;
    const docRef = adminDB.collection("pastMedicalHistory").doc();
    const PMHData = {
      ...formData,
      userId,
      writtenBy: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await docRef.set(PMHData);
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...PMHData },
    });
  } catch (error) {
    if (error instanceof APIAuthError) {
      return error.response;
    }

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

export async function getPMHList() {
  /* "pastMedicalHistory"から、ログイン中のuser.uidと一致するデータを取得する。 */
  try {
    const user = await checkUserOnAPI();
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
    if (error instanceof APIAuthError) return error.response;

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

export async function deletePMH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkUserOnAPI();

    const { id } = params;

    const docRef = adminDB.collection("pastMedicalHistory").doc(id);
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
    if (error instanceof APIAuthError) {
      return error.response;
    }

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

export async function updatePMH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await checkUserOnAPI();
    const { id } = params;
    const body = await request.json();

    const docRef = adminDB.collection("pastMedicalHistory").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "PMH not found" },
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


