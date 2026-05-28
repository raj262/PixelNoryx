<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'posts.view', 'posts.create', 'posts.update', 'posts.delete',
            'categories.manage',
            'subscribers.manage',
            'contacts.manage',
            'faqs.manage',
            'testimonials.manage',
            'users.manage',
            'settings.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $editor = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $vendor = Role::firstOrCreate(['name' => 'vendor', 'guard_name' => 'web']);
        $user = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        $admin->syncPermissions(Permission::all());

        $editor->syncPermissions([
            'posts.view', 'posts.create', 'posts.update', 'posts.delete',
            'categories.manage',
            'faqs.manage',
            'testimonials.manage',
            'subscribers.manage',
            'contacts.manage',
            'settings.manage',
        ]);

        $vendor->syncPermissions(['posts.view']);
        $user->syncPermissions(['posts.view']);

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@pixelnoryx.demo'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $adminUser->syncRoles(['admin']);

        $editorUser = User::firstOrCreate(
            ['email' => 'editor@pixelnoryx.demo'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('editor123'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $editorUser->syncRoles(['editor']);

        $vendorUser = User::firstOrCreate(
            ['email' => 'vendor@pixelnoryx.demo'],
            [
                'name' => 'Vendor User',
                'password' => Hash::make('vendor123'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $vendorUser->syncRoles(['vendor']);

        $regularUser = User::firstOrCreate(
            ['email' => 'user@pixelnoryx.demo'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('user123'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $regularUser->syncRoles(['user']);
    }
}
