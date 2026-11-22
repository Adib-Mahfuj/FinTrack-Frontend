import {useContext, useState} from "react";
import moment from "moment";
import toast from "react-hot-toast";
import Dashboard from "../components/Dashboard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import {Card, CardHeader} from "../components/Card.jsx";
import Input from "../components/input.jsx";
import Button from "../components/Button.jsx";
import AvatarUploader from "../components/AvatarUploader.jsx";
import {AppContext} from "../context/AppContext.jsx";
import {useUser} from "../hooks/useUser.jsx";
import useObjectUrl from "../hooks/useObjectUrl.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import uploadProfileImage from "../util/uploadProfileImage.js";
import {getErrorMessage} from "../util/errorMessage.js";

const MAX_NAME_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

const ErrorBanner = ({message}) =>
    message ? (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
        </p>
    ) : null;

// Name and photo; the email is shown but cannot be changed
const PersonalInfoCard = ({user}) => {
    const {setUser} = useContext(AppContext);

    const [fullName, setFullName] = useState(user.fullName || "");
    const [photoFile, setPhotoFile] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [nameError, setNameError] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const previewUrl = useObjectUrl(photoFile);
    const imageUrl = photoFile ? previewUrl : removePhoto ? null : user.profileImageUrl || null;

    const isDirty = fullName.trim() !== (user.fullName || "") || photoFile !== null || removePhoto;

    const handleSelect = (file) => {
        setPhotoFile(file);
        setRemovePhoto(false);
        setFormError("");
    };

    const handleRemove = () => {
        setPhotoFile(null);
        setRemovePhoto(true);
    };

    const handleDiscard = () => {
        setFullName(user.fullName || "");
        setPhotoFile(null);
        setRemovePhoto(false);
        setNameError("");
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const trimmedName = fullName.trim();
        if (!trimmedName) {
            setNameError("Enter your full name");
            return;
        }

        setSaving(true);
        try {
            // Keep the current photo unless a new one was chosen or the old one was removed
            let profileImageUrl = user.profileImageUrl || "";
            if (photoFile) profileImageUrl = (await uploadProfileImage(photoFile)) || "";
            else if (removePhoto) profileImageUrl = "";

            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_PROFILE, {
                fullName: trimmedName,
                profileImageUrl,
            });

            // Updating the context refreshes the sidebar and top bar immediately
            setUser(response.data);
            setFullName(response.data.fullName);
            setPhotoFile(null);
            setRemovePhoto(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile", error);
            setFormError(getErrorMessage(error, "Failed to update profile. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader title="Personal information" subtitle="Update your name and profile photo."/>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
                <div className="mb-6 flex">
                    <AvatarUploader
                        size="lg"
                        imageUrl={imageUrl}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        disabled={saving}
                    />
                </div>

                <Input
                    value={fullName}
                    onChange={({target}) => {
                        setFullName(target.value);
                        setNameError("");
                    }}
                    label="Full name"
                    type="text"
                    autoComplete="name"
                    maxLength={MAX_NAME_LENGTH}
                    error={nameError}
                />

                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    <Input
                        value={user.email || ""}
                        label="Email address"
                        type="email"
                        disabled
                        helperText="Your email cannot be changed."
                    />
                    <Input
                        value={user.createdAt ? moment(user.createdAt).format("MMMM YYYY") : "—"}
                        label="Member since"
                        type="text"
                        disabled
                    />
                </div>

                <ErrorBanner message={formError}/>

                <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    {isDirty && !saving && (
                        <Button variant="secondary" onClick={handleDiscard}>
                            Discard
                        </Button>
                    )}
                    <Button type="submit" loading={saving} loadingText="Saving..." disabled={!isDirty}>
                        Save changes
                    </Button>
                </div>
            </form>
        </Card>
    );
};

// Current password + new password with confirmation
const PasswordCard = () => {
    const [form, setForm] = useState({currentPassword: "", newPassword: "", confirmPassword: ""});
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (key, value) => {
        setForm((prev) => ({...prev, [key]: value}));
        setErrors((prev) => ({...prev, [key]: undefined}));
        setFormError("");
    };

    const validate = () => {
        const next = {};

        if (!form.currentPassword) next.currentPassword = "Enter your current password";

        if (!form.newPassword) next.newPassword = "Enter a new password";
        else if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
            next.newPassword = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
        } else if (form.newPassword.length > MAX_PASSWORD_LENGTH) {
            next.newPassword = `Use at most ${MAX_PASSWORD_LENGTH} characters`;
        } else if (form.newPassword === form.currentPassword) {
            next.newPassword = "New password must be different from the current one";
        }

        if (form.confirmPassword !== form.newPassword) next.confirmPassword = "Passwords do not match";

        return next;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSaving(true);
        try {
            await axiosConfig.put(API_ENDPOINTS.CHANGE_PASSWORD, {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            setForm({currentPassword: "", newPassword: "", confirmPassword: ""});
            toast.success("Password updated successfully");
        } catch (error) {
            console.error("Failed to change password", error);
            setFormError(getErrorMessage(error, "Failed to update password. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader title="Password" subtitle="Use a strong password you don't use anywhere else."/>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
                <Input
                    value={form.currentPassword}
                    onChange={({target}) => handleChange("currentPassword", target.value)}
                    label="Current password"
                    type="password"
                    autoComplete="current-password"
                    error={errors.currentPassword}
                />

                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    <Input
                        value={form.newPassword}
                        onChange={({target}) => handleChange("newPassword", target.value)}
                        label="New password"
                        type="password"
                        autoComplete="new-password"
                        helperText={`At least ${MIN_PASSWORD_LENGTH} characters`}
                        error={errors.newPassword}
                    />
                    <Input
                        value={form.confirmPassword}
                        onChange={({target}) => handleChange("confirmPassword", target.value)}
                        label="Confirm new password"
                        type="password"
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                    />
                </div>

                <ErrorBanner message={formError}/>

                <div className="mt-2 flex justify-end border-t border-gray-100 pt-5">
                    <Button type="submit" loading={saving} loadingText="Updating...">
                        Update password
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const Profile = () => {
    const user = useUser();

    return (
        <Dashboard activeMenu="Profile">
            <div className="my-5 mx-auto">
                <PageHeader
                    title="Profile"
                    subtitle="Manage your personal information and account security."
                />

                <div className="grid max-w-3xl grid-cols-1 gap-6">
                    {user && <PersonalInfoCard key={user.id} user={user}/>}
                    <PasswordCard/>
                </div>
            </div>
        </Dashboard>
    );
};

export default Profile;