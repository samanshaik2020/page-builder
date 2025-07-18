"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Settings, LayoutTemplate, BarChart, Activity, CheckCircle, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/build" prefetch={false}>
              <Button className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <LayoutTemplate className="h-4 w-4" />
                Choose Template
              </Button>
            </Link>
            <Button variant="outline" className="inline-flex items-center gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Overview Cards */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <LayoutTemplate className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">+3 new this month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234,567</div>
              <p className="text-xs text-gray-500">+15% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,901</div>
              <p className="text-xs text-gray-500">+8% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">Currently live</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Projects Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Recent Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                      <LayoutTemplate className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Product Launch Page</p>
                      <p className="text-sm text-gray-500">Last edited: 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </li>
                <li className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-md flex items-center justify-center text-purple-600">
                      <LayoutTemplate className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Service Offering Page</p>
                      <p className="text-sm text-gray-500">Last edited: 1 day ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </li>
                <li className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center text-green-600">
                      <LayoutTemplate className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Webinar Registration</p>
                      <p className="text-sm text-gray-500">Last edited: 3 days ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/build" prefetch={false}>
                <Button className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  <PlusCircle className="h-4 w-4" />
                  Create New Page
                </Button>
              </Link>
              <Button variant="outline" className="w-full inline-flex items-center justify-center gap-2 bg-transparent">
                <BarChart className="h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full inline-flex items-center justify-center gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Manage Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center py-4 w-full shrink-0 border-t bg-white text-gray-600 text-xs">
        <p>&copy; 2024 LiteBuilder. All rights reserved.</p>
      </footer>
    </div>
  )
}
