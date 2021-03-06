"""
Celery tasks for the search module.
"""

from __future__ import unicode_literals

from lore.celery import async
from statsd.defaults.django import statsd


@async.task
@statsd.timer('lore.search.tasks.refresh_index')
def refresh_index(index_name):
    """
    Refresh the Elasticsearch index via Celery.
    """
    from search.utils import get_conn
    conn = get_conn()
    conn.indices.refresh(index=index_name)
