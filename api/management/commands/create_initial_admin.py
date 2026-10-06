import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or reset the initial admin user"

    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME", "Atchaya@")
        email = os.getenv("ADMIN_EMAIL", "atchayaatchaya943@gmail.com")
        password = os.getenv("ADMIN_PASSWORD")

        if not password:
            self.stdout.write(
                self.style.ERROR(
                    "ADMIN_PASSWORD environment variable is not set."
                )
            )
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        # Always update admin details and password
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user '{username}' created successfully."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user '{username}' password reset successfully."
                )
            )