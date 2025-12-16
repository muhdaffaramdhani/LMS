import { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { authService, UserData } from "../services/authService";
import { courseService, Course } from "../services/courseService";
import { useToast } from "../hooks/use-toast";
import { BookOpen, User as UserIcon, Mail, Save, Loader2, GraduationCap, X, Lock } from "lucide-react";
import api from "../lib/axios";

export default function Profile() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(authService.getUser());
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  
  // State untuk kontrol Tab dan Mode Edit
  const [activeTab, setActiveTab] = useState("settings");
  const [isEditing, setIsEditing] = useState(false);
  
  // Roles
  const isStudent = user?.role === 'student';
  const isLecturer = user?.role === 'lecturer';
  const isAdmin = user?.role === 'admin';

  // Form Data
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    bio: "", 
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        // @ts-ignore
        bio: user.bio || ""
      }));
      
      // Jika bukan admin, fetch courses
      if (!isAdmin) {
        fetchUserSpecificCourses();
      }
    }
  }, [user]);

  const fetchUserSpecificCourses = async () => {
    if (!user || isAdmin) return; 
    
    setIsCoursesLoading(true);
    try {
      if (isStudent) {
        // Fetch Enrollments for Student using the generic endpoint logic we fixed
        // Kita menggunakan endpoint course dengan filter ?enrolled=true yang sudah kita buat di backend
        const data = await courseService.getAll({ enrolled: true });
        // @ts-ignore
        const list = Array.isArray(data) ? data : data.results || [];
        setMyCourses(list);
      } else if (isLecturer) {
        // Fetch Courses taught by Lecturer
        // Lecturer biasanya melihat semua course, tapi difilter di frontend atau backend
        const data = await courseService.getAll();
        // @ts-ignore
        const allCourses = Array.isArray(data) ? data : data.results || [];
        const taughtCourses = allCourses.filter((c: Course) => c.lecturer === user.id);
        setMyCourses(taughtCourses);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setIsCoursesLoading(false);
    }
  };

  const handleEditClick = () => {
    setActiveTab("settings");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original user data
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        // @ts-ignore
        bio: user.bio || ""
      });
      setPasswordData({ newPassword: "", confirmPassword: "" });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return; 

    setIsLoading(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        // @ts-ignore
        bio: formData.bio
      };

      await authService.updateProfile(user.id, payload);
      
      const updatedUser = authService.getUser();
      setUser(updatedUser);
      window.dispatchEvent(new Event('auth-update'));
      
      setIsEditing(false); // Keluar dari mode edit setelah sukses
      toast({ title: "Profile Updated", description: "Your information has been saved successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
       if (!user?.id) return;
       await authService.updateProfile(user.id, { password: passwordData.newPassword });
       setPasswordData({ newPassword: "", confirmPassword: "" });
       toast({ title: "Password Updated", description: "Your password has been changed securely." });
    } catch (error) {
       toast({ title: "Error", description: "Failed to update password.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fullName = (user?.first_name && user?.last_name) 
    ? `${user.first_name} ${user.last_name}` 
    : (user?.first_name || user?.username);

  return (
    <MainLayout>
      <div className="max-w-5xl pb-10 mx-auto animate-fade-in">
        
        {/* Header Profile Card */}
        <Card className="mb-8 overflow-hidden bg-white border-none shadow-lg">
          {/* Background Banner */}
          <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          
          <div className="px-8 pt-10 pb-8">
            <div className="relative flex flex-col items-center gap-6 -mt-16 md:flex-row md:items-end">
              
              {/* Avatar */}
              <Avatar className="w-32 h-32 bg-white border-4 border-white shadow-xl shrink-0">
                <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-700">
                  {fullName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* User Info & Actions */}
              <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 pt-2 text-center md:flex-row md:items-end md:text-left md:pt-0">
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 capitalize">{fullName}</h1>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2 md:justify-start text-muted-foreground">
                      <Badge variant="secondary" className="px-3 py-1 text-sm text-blue-700 capitalize border-blue-200 bg-blue-50 hover:bg-blue-100">
                          {user?.role || "User"}
                      </Badge>
                      <span className="text-sm flex items-center gap-1.5">
                          <Mail className="w-4 h-4" /> {user?.email}
                      </span>
                  </div>
                </div>

                <div className="mb-4 md:mb-2">
                   {!isEditing ? (
                     <Button className="gap-2 text-white bg-gray-900 hover:bg-black" onClick={handleEditClick}>
                        <UserIcon className="w-4 h-4" /> Edit Profile
                     </Button>
                   ) : (
                     <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" /> Cancel Editing
                     </Button>
                   )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Layout */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="justify-start w-full h-auto gap-6 p-0 bg-transparent border-b rounded-none">
            <TabsTrigger 
              value="settings" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-4 py-3 font-medium text-muted-foreground transition-all hover:text-foreground"
            >
              Profile Settings
            </TabsTrigger>
            {!isAdmin && (
              <TabsTrigger 
                value="courses" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 px-4 py-3 font-medium text-muted-foreground transition-all hover:text-foreground"
              >
                {isLecturer ? "Teaching Courses" : "Enrolled Courses"}
              </TabsTrigger>
            )}
          </TabsList>

          {/* TAB: SETTINGS */}
          <TabsContent value="settings" className="space-y-6 animate-in fade-in-50">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              
              {/* Left Column: Personal Info Form */}
              <div className={isEditing ? "lg:col-span-2" : "lg:col-span-3"}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          {isEditing ? "Update your personal details below." : "Your personal details are view-only."}
                        </CardDescription>
                      </div>
                      {!isEditing && (
                        <Badge variant="outline" className="text-gray-500 border-gray-200 bg-gray-50">
                          <Lock className="w-3 h-3 mr-1" /> View Only
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name"
                            value={formData.first_name} 
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                            disabled={!isEditing}
                            className="disabled:opacity-90 disabled:bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name"
                            value={formData.last_name} 
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                            disabled={!isEditing}
                            className="disabled:opacity-90 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          disabled={!isEditing}
                          className="disabled:opacity-90 disabled:bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio"
                          placeholder={isEditing ? "Tell us a little about yourself..." : "No bio provided."}
                          className="min-h-[120px] resize-none disabled:opacity-90 disabled:bg-gray-50"
                          value={formData.bio}
                          // @ts-ignore
                          onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                          disabled={!isEditing}
                        />
                      </div>
                    </form>
                  </CardContent>
                  
                  {isEditing && (
                    <CardFooter className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                        <span className="text-xs text-muted-foreground">Unsaved changes will be lost if you leave.</span>
                        <div className="flex gap-3">
                          <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                          <Button type="submit" form="profile-form" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                          </Button>
                        </div>
                    </CardFooter>
                  )}
                </Card>
              </div>

              {/* Right Column: Security (Only visible when Editing) */}
              {isEditing && (
                <div className="space-y-6 animate-in slide-in-from-right-10 fade-in-20">
                  <Card className="border-blue-100 shadow-sm">
                    <CardHeader className="pb-4 bg-blue-50/50">
                      <CardTitle className="text-lg text-blue-900">Change Password</CardTitle>
                      <CardDescription>Secure your account with a new password.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form id="security-form" onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input 
                            id="new_password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Confirm Password</Label>
                          <Input 
                            id="confirm_password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            placeholder="••••••••"
                          />
                        </div>
                        <Button type="submit" className="w-full mt-2" variant="outline" disabled={isLoading || !passwordData.newPassword}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="border-red-100 bg-red-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-red-700">Danger Zone</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-xs text-red-600/80">
                          Deleting your account is permanent.
                        </p>
                        <Button variant="destructive" size="sm" className="w-full" onClick={() => toast({title: "Action Restricted", description: "Please contact support to delete your account."})}>
                          Delete Account
                        </Button>
                      </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB: COURSES (Dynamic based on role) */}
          {!isAdmin && (
            <TabsContent value="courses" className="space-y-6 animate-in fade-in-50">
               <div className="flex items-center justify-between mb-2">
                 <div>
                   <h2 className="text-xl font-bold tracking-tight">
                       {isLecturer ? "Courses You Teach" : "Enrolled Courses"}
                   </h2>
                   <p className="text-muted-foreground">
                       {isLecturer 
                         ? "Manage the curriculum and students for your classes." 
                         : "Access materials and assignments for your active courses."}
                   </p>
                 </div>
               </div>

               {isCoursesLoading ? (
                 <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
               ) : myCourses.length === 0 ? (
                 <div className="py-16 text-center bg-white border border-gray-300 border-dashed rounded-xl">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50">
                        <GraduationCap className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Courses Found</h3>
                    <p className="max-w-sm mx-auto mt-1 text-gray-500">
                        {isLecturer 
                           ? "You haven't been assigned to teach any courses yet." 
                           : "You haven't enrolled in any courses yet. Go to the Courses page to join one."}
                    </p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myCourses.map((course) => (
                       <Card key={course.id} className="overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-lg border-border/60" onClick={() => window.location.href = `/courses/${course.id}`}>
                          <div className="relative h-32 overflow-hidden bg-gray-100">
                             {course.image ? (
                                <img src={course.image} alt={course.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                             ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-100 to-slate-200">
                                   <BookOpen className="w-10 h-10 text-slate-400" />
                                </div>
                             )}
                             <Badge className="absolute font-semibold shadow-sm top-3 right-3 bg-white/90 text-slate-800 hover:bg-white">
                                {course.code}
                             </Badge>
                          </div>
                          
                          <CardHeader className="pb-3">
                             <CardTitle className="text-lg transition-colors line-clamp-1 group-hover:text-blue-600">
                                {course.name}
                             </CardTitle>
                             {!isLecturer && (
                               <CardDescription className="flex items-center gap-1 line-clamp-1">
                                  <UserIcon className="w-3 h-3" /> 
                                  {course.lecturer_detail?.first_name 
                                     ? `${course.lecturer_detail.first_name} ${course.lecturer_detail.last_name}` 
                                     : 'Instructor'}
                               </CardDescription>
                             )}
                          </CardHeader>
                          
                          <CardContent>
                             <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                {course.description}
                             </p>
                          </CardContent>

                          <CardFooter className="pt-0">
                             <Button 
                                className="w-full text-white transition-colors bg-slate-900 hover:bg-blue-600" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/courses/${course.id}`;
                                }}
                             >
                                Go to Class
                             </Button>
                          </CardFooter>
                       </Card>
                    ))}
                 </div>
               )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}