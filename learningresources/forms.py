"""
Forms for LearningResources
"""

from django.forms import ModelForm
from .models import Course, Repository


class CourseForm(ModelForm):
    """
    Form for the Course object.
    """
    # pylint: disable=no-init,missing-docstring
    # pylint: disable=old-style-class,too-few-public-methods
    class Meta:
        model = Course
        fields = (
            "repository", "org", "course_number", "semester", "imported_by"
        )

class RepositoryForm(ModelForm):
    """
    Form for the Repository resource.
    """
    # pylint: disable=no-init,missing-docstring
    # pylint: disable=old-style-class,too-few-public-methods
    class Meta:
        model = Repository
        fields = (
            "name", "description", "created_by",
        )
