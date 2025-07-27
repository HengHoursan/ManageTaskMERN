"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../api/TaskAction"; // Ensure correct path
import  Loader from '../layouts/Loader.tsx'
type FormData = {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
};

const getStatusBadge = (status: string) => {
  const colorMap: Record<string, string> = {
    "In Progress": "bg-blue-500",
    Completed: "bg-green-500",
    Todo: "bg-gray-500",
    Canceled: "bg-red-500",
    Pending: "bg-yellow-500",
  };
  return (
      <span
          className={`px-2 py-1 text-white text-xs rounded ${
              colorMap[status] || "bg-gray-400"
          }`}
      >
      {status}
    </span>
  );
};

const TaskTable = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditingTask, setisEditingTask] = useState(false);
  const [editTask, setEditTask] = useState<any[]>([]);
  const [viewTask, setViewTask] = useState<any[]>([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const form = useForm<FormData>();

  const statusOptions = ["In Progress", "Completed", "Todo", "Canceled"];
  const priorityOptions = ["Low", "Medium", "High"];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setTasks([]);
      const data = await getTasks(token);
      setTasks(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? task.status === statusFilter : true;
    const matchPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchSearch && matchStatus && matchPriority;
  });
  const handleCreateTask = async (formData:FormData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Missing token");
      await createTask(formData,token);
      setModalOpen(false);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Task created",{
        description: "Task created successfully",
        duration: 4000,
      });
      form.reset();
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    }
    finally {
      setIsLoading(false);
    }
  };
  const handleUpdateTask = async (formData:FormData) => {
    try {
      setIsLoading(true);
      const taskId = editTask?.id
      const getToken = localStorage.getItem("token");
      await updateTask(taskId,formData,getToken);
      setModalOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Task updated", {
        description: "Task updated successfully",
        duration: 4000,
      });
      await fetchData();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error in updating task", error);
    }
  };
  const handleViewTask = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");
      const data = await getTaskById(id, token);
      setViewTask(data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Failed to fetch task", error);
    }
  };
  const handleEditTask = async (task: any) => {
    setModalOpen(true);
    setisEditingTask(true);
    setEditTask(task);
    form.reset({
      title: task.title,
      status: task.status,
      priority: task.priority,
      description: task.description,
      dueDate: task.dueDate,
    });

  }
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Missing token");

      await deleteTask(taskToDelete.id, token);

      // Optimistically update the UI
      setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskToDelete.id)
      );

      setOpenDeleteDialog(false);
      setTaskToDelete(null);

      // Delay for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refresh latest data from server
      await fetchData();

      toast.success("Task deleted", {
        description: "Task deleted successfully",
        duration: 4000,
      });
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async (formData:FormData)=> {
    if (isEditingTask) {
      await handleUpdateTask(formData);
    } else {
      await handleCreateTask(formData);
    }
    console.log("This is form data:",formData);
    setModalOpen(false);
    setisEditingTask(false);
    setEditTask(null);
    form.reset();
    fetchData();
  };
  return (
      <div className="space-y-4 p-4 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold">Welcome back!</h2>
          <Button
              onClick={() => {
                setisEditingTask(false);
                form.reset({
                  title: "",
                  status: "In Progress",
                  priority: "Low",
                  description: "",
                  dueDate: "",
                });
                setModalOpen(true);
              }}
          >
            Add Task
          </Button>
        </div>

        <h2 className="text-sm text-muted-foreground ml-2">
          Here's a list of your tasks for this month.
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
          <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[250px]"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Filters Button */}
          <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPriorityFilter("");
              }}
          >
            Reset
          </Button>
        </div>


        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[150px]">Title</TableHead>
                <TableHead className="w-[300px]">Description</TableHead>
                <TableHead className="w-[120px]">Due Date</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Loader/>
                    </TableCell>
                  </TableRow>
              ) : filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No tasks found.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell className="max-w-[300px] truncate text-sm text-gray-600">
                          {task.description || "No description"}
                        </TableCell>
                        <TableCell>
                          {task.dueDate ? format(new Date(task.dueDate), "PPP") : "N/A"}
                        </TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="font-bold text-gray-700">
                          {task.priority}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setTaskToDelete(task);
                                    setOpenDeleteDialog(true);
                                  }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Task Form Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditingTask ? "Edit Task" : "Create Task"}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Task title" {...field} />
                          </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((priority) => (
                                  <SelectItem key={priority} value={priority}>
                                    {priority}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Optional description" {...field} />
                          </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                      ? format(new Date(field.value), "PPP")
                                      : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) =>
                                      field.onChange(date?.toISOString() || "")
                                  }
                                  initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-2 gap-2.5" >
                  <Button type="submit" onClick={form.handleSubmit(handleSubmitForm)}>
                    {isEditingTask ? "Update Task" : "Create Task"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {/* === VIEW DIALOG === */}
        <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            {viewTask ? (
                <Card className='p-5'>
                  <CardHeader>
                    <CardTitle className='text-[20px]'>Title: {viewTask.title}</CardTitle>
                    <CardTitle className='text-[18px]'>
                      Due Date: {viewTask.dueDate ? new Date(viewTask.dueDate).toLocaleDateString() : "No due date"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Description:</strong> {viewTask.description || "N/A"}</p>
                    <p><strong>Status:</strong> {viewTask.status}</p>
                    <p><strong>Priority:</strong> {viewTask.priority}</p>
                  </CardContent>
                </Card>
            ) : (
                <p>Loading...</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      {/*  Delete Dialog */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p>
              This will permanently delete task:{" "}
              <strong>{taskToDelete?.title}</strong>
            </p>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpenDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteTask}>
                Yes, Delete it.
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isLoading && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader />
            </div>
        )}
      </div>
  );
};
export default TaskTable;
