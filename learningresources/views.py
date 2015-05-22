"""
Views for the learningresource app.
"""
from django.shortcuts import render
from django.contrib.auth.models import User
from learningresources.forms import RepositoryForm


def create_repository(request):
    """
    Create a repository.
    """
    form = RepositoryForm()
    if request.user.is_anonymous():
        request.user, _ = User.objects.get_or_create(username="dirty_hack")
    if request.method == "POST":
        request.POST['created_by'] = request.user
        form = RepositoryForm(request.POST)
        if form.is_valid():
            form.save()
    return render(
        request,
        "create_repository.html",
        {'form': form},
    )
