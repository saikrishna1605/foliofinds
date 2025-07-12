"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingsTab } from "./listings-tab";
import { PostsTab } from "./posts-tab";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="container py-12">
          <header className="mb-8">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </header>
          <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Manage your account, listings, and posts.</p>
      </header>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="posts">My Blog Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Change Photo</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select>
                    <SelectTrigger id="country" className="w-[280px]">
                        <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>My Book Listings</CardTitle>
              <CardDescription>Here are the books you are currently selling.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'listings' && <ListingsTab />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>My Blog Posts</CardTitle>
              <CardDescription>Manage your published articles.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'posts' && <PostsTab />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
