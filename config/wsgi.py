import os
from django.core.wsgi import get_wsgi_application

# Set the default settings module for Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Define the WSGI application
application = get_wsgi_application()

# Add a reference for Vercel to recognize
app = application  # Vercel expects 'app' or 'handler'
