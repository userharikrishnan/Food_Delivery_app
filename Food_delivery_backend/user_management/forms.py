from django import forms
from .models import Customer
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class ExtendedUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    mobile = forms.CharField(max_length=10, required=True)
    address = forms.CharField(max_length=150, required=True)
    image = forms.ImageField(required=False)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('email', 'mobile', 'address', 'image')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        
        if commit:
            user.save()
            
            Customer.objects.create(
                user=user,
                mobile=self.cleaned_data['mobile'],
                address=self.cleaned_data['address'],
                image=self.cleaned_data.get('image'),
                username=user.username
            )
        
        return user