"""
Tests for taxonomy models
"""

from __future__ import unicode_literals

from taxonomy.models import Vocabulary
from learningresources.tests.base import LoreTestCase


class TestModels(LoreTestCase):
    """Tests for taxonomy models"""

    def test_slug(self):
        """Test behavior saving vocabulary slug"""
        vocab = Vocabulary.objects.create(
            repository=self.repo,
            name="vocabname",
            description="description",
            required=False,
            vocabulary_type=Vocabulary.MANAGED,
            weight=1
        )
        self.assertEqual(vocab.name, "vocabname")
        self.assertEqual(vocab.description, "description")
        self.assertEqual(vocab.slug, "vocabname")

        # slug should remain the same
        vocab.save()
        self.assertEqual(vocab.name, "vocabname")
        self.assertEqual(vocab.slug, "vocabname")

        vocab.name = "vocab name"
        vocab.save()
        self.assertEqual(vocab.name, "vocab name")
        self.assertEqual(vocab.slug, "vocabname")
