import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcryptjs.hash("Kuman123@", 10);
    
    // Check if user exists
    const users = await prisma.user.findMany({
      where: { role: "SUPER_ADMIN" }
    });
    
    if (users.length === 0) {
      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: "Men",
          password: hashedPassword,
          role: "SUPER_ADMIN"
        }
      });
      return NextResponse.json({ message: "Created new admin 'Men'" });
    } else {
      const admin = users[0];
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          email: "Men",
          password: hashedPassword
        }
      });
      return NextResponse.json({ message: "Updated existing admin to 'Men'" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
