import CoursePageContainer from "@/app/_components/CoursePageContainer";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default function InstructorPage() {
  return (
    <ProtectedRoute>
      <CoursePageContainer />
    </ProtectedRoute>
  );
}
