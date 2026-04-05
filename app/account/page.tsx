"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AccountLayout } from "@/components/account/account-layout";
import { ProtectedPage } from "@/components/account/protected-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
  }, [user?.name, user?.phone]);

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) return;
    const result = await updateProfile({ name: name.trim(), phone: phone || undefined });
    if (result?.success) {
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <ProtectedPage>
      <AccountLayout
        title="My Account"
        description="Manage your profile details and account preferences."
      >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your account details
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setName(user?.name || "");
                      setPhone(user?.phone || "");
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {saved && (
                <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  Profile updated successfully!
                </div>
              )}

              <div className="space-y-2">
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <p className="rounded-md bg-muted px-3 py-2 text-sm">
                    {user?.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <p className="rounded-md bg-muted px-3 py-2 text-sm">
                  {user?.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                ) : (
                  <p className="rounded-md bg-muted px-3 py-2 text-sm">
                    {user?.phone || "Not provided"}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
      </AccountLayout>
    </ProtectedPage>
  );
}
