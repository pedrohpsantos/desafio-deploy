from django.test import TestCase

class SimpleTest(TestCase):
    def test_always_passes(self):
        """Um teste simples que sempre passa para o CI."""
        x=1
        self.assertTrue(True)