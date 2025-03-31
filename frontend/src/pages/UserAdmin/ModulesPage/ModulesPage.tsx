import { jwtDecode } from "jwt-decode";
import {
    Users,
    Clock,
    Briefcase,
    CheckCircle2,
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../../services/users.api";
import { useAuth } from '../../../services/auth';
import { Token } from "../../../interfaces";

const ModulesPage = () => {
    const { isAuth } = useAuth();
    const userId: number = isAuth
        ? jwtDecode<Token>(useAuth.getState().getToken().access).user_id
        : 0;

    const {
        data: user,

    } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });

    const stats = [
        { name: 'Total Projects', value: '12', icon: Briefcase, trend: '+2.5%', positive: true },
        { name: 'Active Tasks', value: '64', icon: CheckCircle2, trend: '+12%', positive: true },
        { name: 'Hours Logged', value: '164', icon: Clock, trend: '-5%', positive: false },
        { name: 'Team Members', value: '8', icon: Users, trend: '+1', positive: true },
    ];

    const recentActivity = [
        { id: 1, type: 'task', title: 'UI Design Review', status: 'completed', time: '2h ago' },
        { id: 2, type: 'comment', title: 'New Client Feedback', status: 'pending', time: '4h ago' },
        { id: 3, type: 'project', title: 'E-commerce Launch', status: 'in-progress', time: '8h ago' },
        { id: 4, type: 'task', title: 'API Integration', status: 'delayed', time: '1d ago' },
    ];

    return (
        <>
            {/* Main Content */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
                        <p className="mt-1 text-lg text-gray-500">Here's what's happening with your projects today.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 shadow-lg">
                                                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                                                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {stat.trend}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
                                </div>
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {recentActivity.map((activity, index) => (
                                            <li key={activity.id}>
                                                <div className="relative pb-8">
                                                    {index
                                                        < recentActivity.length - 1 && (
                                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                        )}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.status === 'completed' ? 'bg-green-500' :
                                                                activity.status === 'in-progress' ? 'bg-blue-500' :
                                                                    activity.status === 'delayed' ? 'bg-red-500' : 'bg-yellow-500'
                                                                }`}>
                                                                <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">{activity.title}</p>
                                                            </div>
                                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                <time dateTime="2020-09-20">{activity.time}</time>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Upcoming Tasks</h2>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View calendar</a>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Design Review', time: 'Today, 2:00 PM', status: 'urgent', attendees: 4 },
                                        { title: 'Client Meeting', time: 'Tomorrow, 10:00 AM', status: 'normal', attendees: 3 },
                                        { title: 'Team Sync', time: 'Wed, 11:00 AM', status: 'normal', attendees: 6 },
                                    ].map((task, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`h-3 w-3 rounded-full ${task.status === 'urgent' ? 'bg-red-500' : 'bg-green-500'
                                                        }`} />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                                        <p className="text-sm text-gray-500">{task.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex -space-x-1 relative z-0">
                                                        {[...Array(task.attendees)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 ring-2 ring-white flex items-center justify-center">
                                                                <Users className="h-4 w-4 text-white" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModulesPage;