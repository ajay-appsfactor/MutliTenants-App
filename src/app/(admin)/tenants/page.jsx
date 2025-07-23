"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { rootDomain, protocol } from "@/lib/utils";

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState("");

  async function fetchTenants() {
    const res = await fetch("/api/admin/tenants");
    const data = await res.json();
    if (data.success) setTenants(data.tenants);
  }

  useEffect(() => {
    fetchTenants();
  }, []);

  // Subdomain validation function
  const isValidSubdomain = (value) => /^[a-z0-9-]+$/.test(value);

  async function handleCreateTenant(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate subdomain format
    if (!isValidSubdomain(subdomain)) {
      setError(
        "Subdomain can only have lowercase letters, numbers, and hyphens. Please try again."
      );
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/tenants", {
      method: "POST",
      body: JSON.stringify({ name, subdomain }),
    });

    const result = await res.json();

    if (result.success) {
      setOpen(false);
      setName("");
      setSubdomain("");
      fetchTenants();
    } else {
      setError(result.message || "Failed to create tenant");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Create Tenant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTenant} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium mb-1">
                  Organization Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Input
                      id="subdomain"
                      name="subdomain"
                      placeholder="your-subdomain"
                      value={subdomain}
                      onChange={
                        (e) => setSubdomain(e.target.value.toLowerCase()) // force lowercase
                      }
                      className="w-full rounded-r-none focus:z-10"
                      required
                    />
                  </div>
                  <span className="bg-gray-100 px-3 border border-l-0 border-input rounded-r-md text-gray-500 min-h-[36px] flex items-center">
                    .{rootDomain}
                  </span>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? "Creating Subdomain..." : "Create Subdomain"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization Name</TableHead>
            <TableHead>Subdomain</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>DB URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No tenants found.
              </TableCell>
            </TableRow>
          )}
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.name}</TableCell>
              <TableCell>
                <Link
                  target="_blank"
                  href={`${protocol}://${tenant.subdomain}.${rootDomain}`}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {tenant.subdomain}.{rootDomain}
                </Link>
              </TableCell>
              <TableCell>
                {format(new Date(tenant.created_at), "dd MMM yyyy hh:mm a")}
              </TableCell>
              <TableCell className="truncate max-w-xs">
                {tenant.db_url}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
