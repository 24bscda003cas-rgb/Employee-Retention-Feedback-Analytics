import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the initial admin user"

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

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user '{username}' created successfully."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"Admin user '{username}' already exists."
                )
            )
