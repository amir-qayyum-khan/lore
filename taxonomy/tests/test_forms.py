"""
Tests for taxonomy forms
"""
from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.test.testcases import TestCase
from django.db.utils import IntegrityError
from django.db import transaction

from taxonomy.forms import VocabularyForm
from taxonomy.models import Vocabulary
from learningresources.models import LearningResourceType
from importer.api import import_course_from_file
from importer.tests.test_import import get_course_zip

from learningresources.models import Repository


class TestForms(TestCase):
    """Tests for taxomony forms"""

    def setUp(self):
        """
        Initialize
        """
        self.user, _ = User.objects.get_or_create(username="test")

        import_course_from_file(get_course_zip(), self.user.id)

        self.video_type, _ = LearningResourceType.objects.get_or_create(
            name="video")

    def test_new(self):
        """
        Create a new vocabulary
        """

        form = VocabularyForm({
            'name': 'name',
            'description': 'description',
            'vocabulary_type': Vocabulary.FREE_TAGGING,
            'learning_resource_types': [self.video_type.id],
        })
        form.instance.repository = Repository.objects.order_by('id').first()
        form.instance.required = False
        form.instance.weight = 1000
        self.assertEquals(0, Vocabulary.objects.count())
        form.save()
        self.assertEquals(1, Vocabulary.objects.count())

        form = VocabularyForm({
            'name': 'name',
            'description': 'description',
            'vocabulary_type': Vocabulary.FREE_TAGGING,
            'learning_resource_types': [self.video_type.id],
        })
        form.instance.repository = Repository.objects.order_by('id').first()
        form.instance.required = False
        form.instance.weight = 1000

        # duplicate save should fail on unique constraint
        # pylint: disable=unnecessary-lambda
        with transaction.atomic():
            self.assertRaises(IntegrityError, lambda: form.save())
        self.assertEquals(1, Vocabulary.objects.count())
