"""
URLs for the learning objects app.
"""
from django.conf.urls import url, patterns
from learningresources.views import create_repository

urlpatterns = patterns(
    "",
    url(r'^create/$', create_repository, name='create_repository'),
)
