from django.urls import path

from webapp.views import MainView

urlpatterns = [
    path('', MainView.as_view(), name='main_view_url')
]
